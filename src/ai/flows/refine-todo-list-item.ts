'use server';

/**
 * @fileOverview Refines todo list items with AI assistance to make the instructions clearer and more actionable.
 *
 * - refineTodoListItem - A function that refines a todo list item.
 * - RefineTodoListItemInput - The input type for the refineTodoListItem function.
 * - RefineTodoListItemOutput - The return type for the refineTodoListItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineTodoListItemInputSchema = z.object({
  todoListItem: z.string().describe('The todo list item to refine.'),
});
export type RefineTodoListItemInput = z.infer<typeof RefineTodoListItemInputSchema>;

const RefineTodoListItemOutputSchema = z.object({
  refinedTodoListItem: z.string().describe('The refined todo list item.'),
  isDistinct: z
    .boolean()
    .describe(
      'Whether or not the refined todo list item contains instructions that are distinct and that can make following directions easier.'
    ),
});
export type RefineTodoListItemOutput = z.infer<typeof RefineTodoListItemOutputSchema>;

export async function refineTodoListItem(
  input: RefineTodoListItemInput
): Promise<RefineTodoListItemOutput> {
  return refineTodoListItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineTodoListItemPrompt',
  input: {schema: RefineTodoListItemInputSchema},
  output: {schema: RefineTodoListItemOutputSchema},
  prompt: `You are an AI assistant that helps users refine their todo list items.

  You will be given a todo list item, and you will refine it to make the instructions clearer and more actionable.

  You will also determine whether or not the refined todo list item contains instructions that are distinct and that can make following directions easier, and set the isDistinct output field appropriately.

  Todo List Item: {{{todoListItem}}}`,
});

const refineTodoListItemFlow = ai.defineFlow(
  {
    name: 'refineTodoListItemFlow',
    inputSchema: RefineTodoListItemInputSchema,
    outputSchema: RefineTodoListItemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
