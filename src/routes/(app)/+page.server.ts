import { BOT_GROUP_ID } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    if (url.searchParams.get('tgWebAppStartParam') !== BOT_GROUP_ID) {
        return error(401);
    }
};