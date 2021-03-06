/**
 * A Navigable is a component that takes part in the navigation tree.
 *
 * When we render it, if it is an active component, it needs to know
 * where it stands in the tree.
 */
import { UsesLocation } from './location-manager';
import { StateCondition } from './location-state-space/state-space/StateSpace';

export type LeaveQuestionGenerator = () => string | null | undefined;

/**
 * These are the hooks that a Navigable component can optionally implement and register
 * to a nav control.
 */
export interface NavStateHooks {
    /**
     * Is it OK if we leave this state right now?
     * If there is some unsaved data, then return a string,
     * which will be presented to the user, in a question to confirm.
     *
     * If there is no unsaved data, return null or undefined.
     */
    getLeaveQuestion?: LeaveQuestionGenerator;
}

/**
 * Nav control interface, to control various aspects of the navigation
 */
export interface NavControl {
    registerStateHooks: (hooks: NavStateHooks) => void;
}

/**
 * This data structure will be made available to components
 * that are rendered as part of the navigation process
 */
export interface Navigable<WidgetType, DataType> {
    /**
     * The number of tokens that have already been parsed, is any.
     *
     * (The selection should be determined by the first un-parsed token.)
     */
    parsedTokens?: number;

    filterCondition?: StateCondition<DataType>;
    fallback?: WidgetType;
    part?: string;
}

/**
 * This data structure will be made available to components
 * that are rendered as part of the navigation process,
 * and have own content
 */
export interface NavigableContent<WidgetType, DataType> extends Navigable<WidgetType, DataType> {
    navControl: NavControl;
}

/**
 * Extract the next path token from the location manager, based on the number of parsed tokens passed down
 */
export function getNextPathToken<WidgetType, DataType>(props: Navigable<WidgetType, DataType> & UsesLocation): string {
    const { locationManager, parsedTokens } = props;
    return locationManager!.pathTokens[parsedTokens!];
}

/**
 * Extract the already parsed path tokens from the location manager, based on the number of parsed tokens passed down
 */
export function getParsedPathTokens<WidgetType, DataType>(props: Navigable<WidgetType, DataType> & UsesLocation) {
    const { locationManager, parsedTokens } = props;
    return locationManager!.pathTokens.slice(0, parsedTokens!);
}
