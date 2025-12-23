import * as v from 'valibot';
import { command } from '$app/server';
import listService, { type CategoryCommand } from '$lib/server/list.service';
import { storageKey } from '$lib/server/utils/config';
import { redis } from '$lib/server/utils/redis';
import { error } from '@sveltejs/kit';

const categoryCommandValidation = v.object({
    id: v.string(),
    label: v.string(),
    emoji: v.string(),
});

export const createCategory = command(categoryCommandValidation, async (category: CategoryCommand) => {
    const storageExists = await redis.exists(storageKey);
    if (!storageExists) {
        await listService.initList();
    }

    const categoryExists = await listService.existsCategory(category.id);
    if (categoryExists) {
        return error(409, `Category with id "${category.id}" exists already`);
    }

    await listService.addCategory(category);
});

export const updateCategory = command(categoryCommandValidation, async (updateCategoryCommand: CategoryCommand) => {
    await listService.updateCategory(updateCategoryCommand);
});