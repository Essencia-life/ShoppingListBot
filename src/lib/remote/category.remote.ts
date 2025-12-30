import * as v from 'valibot';
import { command } from '$app/server';
import listService from '$lib/server/list.service';
import { storageKey } from '$lib/server/utils/config';
import { redis } from '$lib/server/utils/redis';

const createCategoryCommand = v.object({
    label: v.string(),
    emoji: v.string(),
});

const updateCategoryCommand = v.object({
    id: v.pipe(v.string(), v.uuid()),
    label: v.string(),
    emoji: v.string(),
});

export const createCategory = command(createCategoryCommand, async (createCategory) => {
    const storageExists = await redis.exists(storageKey);
    if (!storageExists) {
        await listService.initList();
    }

    const category = {
        id: crypto.randomUUID(),
        ...createCategory,
    }

    await listService.addCategory(category);
});

export const updateCategory = command(updateCategoryCommand, async (updateCategoryCommand) => {
    await listService.updateCategory(updateCategoryCommand);
});

export const deleteCategory = command(v.pipe(v.string(), v.uuid()), async (categoryId) => {
    await listService.deleteCategory(categoryId);
});