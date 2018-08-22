import { MeteorTableData, MeteorTableQuery } from './MeteorTableFetcher';
import { action } from 'mobx';
import { MethodDataFetcherImpl } from './MethodDataFetcherImpl';
import { MeteorDataFetcherDone } from './MeteorDataFetcher';

export class MeteorTableFetcherImpl<T> extends MethodDataFetcherImpl<MeteorTableQuery, MeteorTableData<T>> {
    constructor(
        private readonly _fetchData: (query: MeteorTableQuery, done: MeteorDataFetcherDone<MeteorTableData<T>>) => void
    ) {
        super();
    }
    getInitialData() {
        return { totalCount: 0, data: [] };
    }
    @action.bound
    callFetchData(query: MeteorTableQuery, done: MeteorDataFetcherDone<MeteorTableData<T>>): void {
        this._fetchData(query, (error, data) => {
            // if there is an error, we set the error in the data
            if (error) {
                return done(error, { error, ...this.getInitialData() });
            }
            return done(error, data);
        });
    }
}