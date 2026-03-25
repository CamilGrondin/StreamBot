export let apps: {
    script: string;
    watch: string;
    name: string;
}[];
export namespace deploy {
    let production: {
        user: string;
        host: string;
        password: string;
        ref: string;
        repo: string;
        path: string;
        'pre-deploy-local': string;
        'post-deploy': string;
        'pre-setup': string;
    };
}
