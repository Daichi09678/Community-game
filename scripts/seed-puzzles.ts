import { db } from '@/lib/db/drizzle';
import { puzzles } from '@/lib/db/drizzle/schema/puzzles';
import { puzzlesData } from '../components/puzzle/puzzlesData';

async function seedPuzzles() {
  console.log('🌱 Seeding puzzles...');
  
  for (const puzzle of puzzlesData) {
    try {
      await db.insert(puzzles).values({
        title: puzzle.title,
        game: puzzle.game,
        difficulty: puzzle.difficulty,
        type: puzzle.type,
        question: puzzle.question,
        options: puzzle.options ? JSON.stringify(puzzle.options) : null,
        answer: puzzle.answer,
        hint: puzzle.hint,
        lore: puzzle.lore,
        points: puzzle.points,
        timeLimit: puzzle.timeLimit || 0,
        orderIndex: puzzle.orderIndex,
        solvedBy: 0,
      });
      console.log(`✅ Added: ${puzzle.title}`);
    } catch (error) {
      console.error(`❌ Failed to add ${puzzle.title}:`, error);
    }
  }
  
  console.log('🎉 Seeding complete!');
}

seedPuzzles().catch(console.error);