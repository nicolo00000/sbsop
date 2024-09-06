import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userFiles } from '@/lib/db/schema';
import { auth } from "@clerk/nextjs/server";
import { promises as fs } from 'fs';
import path from 'path';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the SOP files related to the user
    const files = await db.select()
      .from(userFiles)
      .where(eq(userFiles.userId, userId))
      .orderBy(desc(userFiles.createdAt));

    // Filter only the 'sop' file types
    const sopFiles = files.filter(file => file.fileType === 'sop');

    // Read the SOP content from the file system using the filePath
    const filesWithContent = await Promise.all(
      sopFiles.map(async (file) => {
        const sopPath = path.resolve(file.filePath);  // Resolve the file path
        try {
          const content = await fs.readFile(sopPath, 'utf-8');  // Read the content from file
          return { ...file, content };  // Add the file content to the response
        } catch (err) {
          console.error(`Error reading SOP file at ${sopPath}:`, err);
          return { ...file, content: 'Error reading SOP file' };  // Return an error message if file can't be read
        }
      })
    );

    return NextResponse.json(filesWithContent);  // Return all SOP files with content
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
