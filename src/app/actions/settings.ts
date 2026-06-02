'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { DiabetesType } from '@/generated/prisma/client';

export type SettingsState = { success?: boolean; message?: string } | undefined;

export async function updateProfile(state: SettingsState, formData: FormData): Promise<SettingsState> {
  const { userId } = await auth();
  if (!userId) throw new Error('You must be signed in to update settings.');

  try {
    const name = (formData.get('name') as string)?.trim();
    const ageRaw = formData.get('age') as string;
    const diabetesType = formData.get('diabetesType') as string;
    const onInsulin = formData.get('onInsulin') === 'true';

    if (!name || name.length < 2) return { success: false, message: 'Name must be at least 2 characters.' };
    const age = parseInt(ageRaw, 10);
    if (isNaN(age) || age < 1 || age > 150) return { success: false, message: 'Please enter a valid age.' };

    const validTypes = ['TYPE_1', 'TYPE_2', 'PRE_DIABETIC', 'NOT_SURE'];
    if (!validTypes.includes(diabetesType)) return { success: false, message: 'Please select a valid diabetes type.' };

    await prisma.user.update({
      where: { id: userId },
      data: { name, age, diabetesType: diabetesType as DiabetesType, onInsulin },
    });

    revalidatePath('/settings');
    revalidatePath('/dashboard');
    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, message: 'Failed to update profile. Please try again.' };
  }
}
