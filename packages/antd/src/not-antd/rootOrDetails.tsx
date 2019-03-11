import * as React from 'react';
import { hiddenStyle } from './LocationDependentArea';

const uuidv4 = require('uuid/v4');
import {
    getNextPathToken,
    isTokenEmpty,
    Navigable,
    NavStateHooks,
    SubStateCoreInfo,
    TestLocation,
    UsesLocation,
} from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import { renderSubStateCore } from './rendering';
import { UIFragmentSpec } from './UIFragmentSpec';

/**
 * This is the full spec of the root-or-details component
 */
interface OwnProps<DataType> {
    /**
     * What to show when the root state is selected?
     */
    ifRoot: SubStateCoreInfo<UIFragmentSpec, DataType>;

    /**
     * What to show when a sub-state is selected?
     */
    ifDetails: SubStateCoreInfo<UIFragmentSpec, DataType>;

    /**
     * Should we mount (but hide) both possibilities at the same time?
     *
     * This will render an extra div around all children, and add `display: none` style to those that are inactive.
     *
     * Defaults to false.
     */
    mountAll?: boolean;
}

type ComponentProps<DataType> = UsesLocation & Navigable<UIFragmentSpec, DataType>;

export interface DetailProps {
    token: string;
}

export function rootOrDetails<DataType>(ownProps: OwnProps<DataType>) {
    const nodeId = uuidv4();
    return inject('locationManager')(
        observer(
            (props: ComponentProps<DataType>): JSX.Element | null => {
                let rootHooks: NavStateHooks | undefined;
                const registerNavStateHooksForRoot = (hooks: NavStateHooks) => (rootHooks = hooks);

                let detailHooks: NavStateHooks | undefined;
                const registerNavStateHooksForDetail = (hooks: NavStateHooks) => (detailHooks = hooks);

                /**
                 * We register ourselves as a change interceptor,
                 * because we might have to hide some content
                 * on location changes, and we want to know about that
                 * in advance, so that we can suggest some questions to ask
                 * from the user.
                 */
                props.locationManager!.registerChangeInterceptor({
                    getId() {
                        return nodeId;
                    },

                    /**
                     * This is our "change interceptor" hook, that will be called by the
                     * `LocationManager`.
                     */
                    // tslint:disable-next-line:cyclomatic-complexity
                    anyQuestionsFor(location: TestLocation): string[] {
                        const oldToken = getNextPathToken(props);
                        const oldRoot = isTokenEmpty(oldToken);

                        const newToken = location.pathTokens[props.parsedTokens!];
                        const newRoot = isTokenEmpty(newToken);

                        if (newRoot) {
                            if (oldRoot) {
                                // Staying at root, nothing to do.
                            } else {
                                // Going from detail to root.
                                // We would hide the detail, so check with it.
                                if (detailHooks && detailHooks.getLeaveQuestion) {
                                    const q = detailHooks.getLeaveQuestion();
                                    return q ? [q] : [];
                                }
                            }
                        } else {
                            if (oldRoot) {
                                // Going from root to detail.
                                // We would hide the root, so check with it.
                                if (rootHooks && rootHooks.getLeaveQuestion) {
                                    const q = rootHooks.getLeaveQuestion();
                                    return q ? [q] : [];
                                }
                            } else {
                                // Staying ad detail, nothing to do
                            }
                        }
                        return [];
                    },
                });

                const { ifRoot, ifDetails, mountAll } = ownProps;

                const renderRoot = (): JSX.Element | null =>
                    renderSubStateCore({
                        state: ifRoot,
                        navigationContext: props,
                        checkCondition: true,
                        navControl: {
                            registerStateHooks: registerNavStateHooksForRoot,
                        },
                    });
                const renderDetail = () =>
                    renderSubStateCore({
                        state: ifDetails,
                        navigationContext: props,
                        tokenIncrease: 1,
                        extraProps: { token },
                        checkCondition: true,
                        navControl: {
                            registerStateHooks: registerNavStateHooksForDetail,
                        },
                    });

                const token = getNextPathToken(props);
                const atRoot = isTokenEmpty(token);

                if (mountAll) {
                    return (
                        <div key={'root-or-detail-selection'}>
                            <div key={'root'} style={atRoot ? {} : hiddenStyle}>
                                {renderRoot()}
                            </div>
                            <div key={'detail'} style={atRoot ? hiddenStyle : {}}>
                                {renderDetail()}
                            </div>
                        </div>
                    );
                } else {
                    return atRoot ? renderRoot() : renderDetail();
                }
            }
        )
    );
}
