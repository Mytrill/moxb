import { observable } from 'mobx';
import * as React from 'react';
import { Menu } from 'antd';
import { observer, inject } from 'mobx-react';
import {
    SubStateInContext,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerProps,
    LocationDependentStateSpaceHandlerImpl,
} from '@moxb/moxb';
import * as Anchor from '../not-antd/Anchor';
import { renderUIFragment, UIFragment, UIFragmentSpec } from '../not-antd';

export interface NavMenuProps<DataType>
    extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
    /**
     * Any extra menu items to add
     */
    extras?: JSX.Element[];

    /**
     * Any direct styles to apply
     */
    style?: React.CSSProperties;
}

@inject('locationManager')
@observer
/**
 * This widget show an Ant menu bar, based on the state-space.
 */
export class NavMenuBarAnt<DataType> extends React.Component<NavMenuProps<DataType>> {
    protected readonly _id: string;
    @observable.ref
    protected _states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>;

    public constructor(props: NavMenuProps<DataType>) {
        super(props);
        this._renderSubStateLink = this._renderSubStateLink.bind(this);
        this._renderSubStateGroup = this._renderSubStateGroup.bind(this);
        this._renderSubStateElement = this._renderSubStateElement.bind(this);
        this._id = this.props.id || 'no-id';
        this._states = this.getLocationDependantStateSpaceHandler();
    }

    private getLocationDependantStateSpaceHandler() {
        const { id, children: _children, extras, style, ...stateProps } = this.props;

        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'menu bar of ' + this._id,
        });
    }

    componentDidUpdate() {
        // to be reactive, we have to update the
        this._states = this.getLocationDependantStateSpaceHandler();
    }

    // tslint:disable-next-line:cyclomatic-complexity
    protected _renderSubStateLink(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        const { label, key, menuKey, newWindow, itemClassName, linkClassName, linkStyle, noLink, title } = state;
        if (noLink) {
            return <Menu.Item key={menuKey}>{renderUIFragment(label || key || 'item')}</Menu.Item>;
        } else {
            const url = this._states.getUrlForSubState(state);
            const anchorProps: Anchor.UIProps = {
                label: label || key,
                href: url,
                target: newWindow ? '_blank' : undefined,
                onClick: newWindow ? undefined : () => this._states.selectSubState(state),
                style: linkStyle,
                title,
            };
            if (linkClassName) {
                anchorProps.className = linkClassName;
            }
            const itemProps: any = {};
            if (itemClassName) {
                itemProps.className = itemClassName;
            }
            return (
                <Menu.Item key={menuKey} {...itemProps}>
                    <Anchor.Anchor {...anchorProps} />
                </Menu.Item>
            );
        }
    }

    protected _renderSubStateGroup(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        const { label, key, subStates, flat, menuKey, linkStyle } = state;
        if (!flat && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        return (
            <Menu.SubMenu key={menuKey} title={renderUIFragment(label || key || '***')} style={linkStyle}>
                {subStates!.map(this._renderSubStateElement)}
            </Menu.SubMenu>
        );
    }

    protected _renderSubStateElement(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        const { isGroupOnly } = state;
        return isGroupOnly ? this._renderSubStateGroup(state) : this._renderSubStateLink(state);
    }

    public render() {
        // AndD's Menu is smart enough to automatically indicate active state
        // on all groups, so we only ask for the leaves.
        const selectedMenuKeys = this._states.getActiveSubStateMenuKeys(true);
        const { extras, style } = this.props;
        return (
            <Menu selectedKeys={selectedMenuKeys} mode="horizontal" style={style}>
                {this._states
                    .getFilteredSubStates({
                        onlyVisible: true,
                        onlySatisfying: true,
                    })
                    .map(this._renderSubStateElement)}
                {...extras || []}
            </Menu>
        );
    }
}
