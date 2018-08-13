import { SortDirection } from './TableSort';
import { Bind } from '..';

export interface TableColumn extends Bind {
    /**
     * The name of the column in the table. By default, it is the same as the id!
     */
    readonly column: string;

    /**
     * This is the column used for sorting and searching -- it might be different form the field  name in the structure.
     * By default it's the same as the column.
     */
    readonly tableColumn: string;

    /**
     * Should be called when the column is clicked to sort on this column. If the column is not sortable, nothing
     * happens.
     */
    toggleSort(): void;

    /**
     * If column is not sortable, this is undefined. Else this is the preferred (natural) sort direction.
     */
    readonly preferredSortDirection?: SortDirection;

    readonly sortable: boolean;

    /**
     * The current sort direction if it the column is the primary sort column
     */
    readonly sortDirection?: SortDirection;

    /**
     * The width is used in the Table.HeaderCell to manually set the column width
     */
    readonly width?: number;
}
