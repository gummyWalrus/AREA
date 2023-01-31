export interface IRepo {
    id?: number;
    name?: string;
    full_name?: string;
    url?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface INewRepo {
    name: string;
    description: string;
    homepage: string;
    private: boolean;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
}

export interface IUpdateRepo extends INewRepo {
    owner: string;
    repo: string;
}

export interface IDeleteRepo {
    owner: string;
    repo: string;
}

export interface INewRepoOrg extends INewRepo {
    org: string;
}

export interface IUpdateRepoOrg extends INewRepoOrg {
    repo: string;
}

export interface IDeleteRepoOrg {
    org: string;
    name: string;
}