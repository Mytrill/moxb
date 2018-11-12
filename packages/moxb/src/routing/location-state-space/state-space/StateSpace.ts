/**
 * This interface describes a possible state for a part of the app UI
 *
 * Since this data structure is UI-Framework agnostic,
 * you will have to provide your own UI-related (label and content) types
 * as type parameters.
 */

export interface SubState<LabelType, WidgetType> {
    /**
     * The label to identify this sub-state,
     *
     * when offered up for selection in a menu or similar
     */
    label: LabelType;

    /**
     * A special label to use when this sub-state is active
     */
    activeLabel?: LabelType;

    /**
     * The key to identify this sub-state. (Can be undefined if this is the root state)
     */
    key?: string;

    /**
     * Is this the root state?
     */
    root?: boolean;

    /**
     * Should this option be offered in menus and such?
     */
    hidden?: boolean;

    /**
     * Is this option currently disabled? If yes, this will option will be displayed, but won't be selectable.
     */
    disabled?: boolean;

    /**
     * What content so show in this sub-state?
     */
    fragment?: WidgetType;

    /**
     * Any further child states (for sub-menus, etc)
     */
    subStates?: SubState<LabelType, WidgetType>[];

    /**
     * If this is a group menu item, should the items in this group be added "flat" in the same spacec,
     * without prefixing the key of this state? (defaults to false.)
     */
    flat?: boolean;

    /**
     * Custom data
     */
    custom?: any;
}

/**
 * The totality of all possible states for a given part of the app UI
 */
export type StateSpace<LabelType, WidgetType> = SubState<LabelType, WidgetType>[];

/**
 * This interface describes how the identify a sub-state within a state-space
 */
export interface SubStateInContext<LabelType, WidgetType> extends SubState<LabelType, WidgetType> {
    /**
     * What are the parent path tokens to choose to reach the level
     * where the current sub-state is directly accessible?
     */
    parentPathTokens: string[];

    /**
     * What are the parent path tokens to choose to reach this sub-state?
     */
    totalPathTokens: string[];

    /**
     * Is this only a group item, created for menus?
     */
    isGroupOnly: boolean;

    /**
     * The menu key generated for this sub-state
     */
    menuKey: string;

    /**
     * We are restricting the SubStates array so that we know that they all must have context, too
     */
    subStates?: SubStateInContext<LabelType, WidgetType>[];
}

/**
 * A condition used to decide whether or not to offer a given SubState
 */
export type StateCondition<LabelType, WidgetType> = (item: SubState<LabelType, WidgetType>) => boolean;
