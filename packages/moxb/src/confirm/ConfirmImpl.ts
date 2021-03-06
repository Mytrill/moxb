import { action, observable } from 'mobx';
import { Bind } from '../bind/Bind';
import { t } from '../i18n/i18n';
import { Confirm } from './Confirm';

export interface ConfirmOptions<T> {
    cancelButton: Bind;
    confirmButton: Bind;
    content?(data: T): string;
    header?(data: T): string;
    confirm?(data: T): void;
    cancel?(): void;
}

export class ConfirmImpl<T> implements Confirm<T> {
    @observable
    open = false;
    @observable
    data!: T;
    private readonly impl: ConfirmOptions<T>;

    constructor(impl: ConfirmOptions<T>) {
        this.impl = impl;
    }

    @action.bound
    show(data: T) {
        this.data = data;
        this.open = true;
    }

    @action.bound
    onCancel() {
        this.open = false;
        if (this.impl.cancel) {
            this.impl.cancel();
        }
    }

    @action.bound
    onConfirm() {
        this.open = false;
        if (this.impl.confirm) {
            this.impl.confirm(this.data);
        }
    }

    get cancelButton() {
        return this.impl.cancelButton;
    }

    get confirmButton() {
        return this.impl.confirmButton;
    }

    get content() {
        if (this.impl.content) {
            if (this.open) {
                return this.impl.content(this.data);
            } else {
                return '';
            }
        }
        return t('ConfirmDialog.defaultContent', 'Are you sure?');
    }

    get header() {
        if (this.open && this.impl.header) {
            return this.impl.header(this.data);
        }
        return '';
    }
}
