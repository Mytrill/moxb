export interface ViewStore {
    page: string;
    openIndexPage(): void;
    openLoginFormPage(): void;
    openMemTablePage(): void;
    currentUrl?: string;
}
