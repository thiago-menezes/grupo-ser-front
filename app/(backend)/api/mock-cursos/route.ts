import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { CourseAPIRaw } from '@/packages/bff/services/courses-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Lê o arquivo db.json
    const dbPath = join(process.cwd(), 'mock-api', 'db.json');
    const dbContent = readFileSync(dbPath, 'utf-8');
    const cursosData = JSON.parse(dbContent);

    let cursos = cursosData.cursos;

    // Suporta query params do json-server
    // Exemplo: /api/cursos?Estado=SP&Modalidade=Presencial
    searchParams.forEach((value, key) => {
      if (key === '_limit' || key === '_page') return;

      cursos = cursos.filter((curso: CourseAPIRaw) => {
        const courseKey = key as keyof CourseAPIRaw;
        const courseValue = String(curso[courseKey] ?? '').toLowerCase();
        const searchValue = String(value).toLowerCase();
        return courseValue.includes(searchValue);
      });
    });

    // Paginação
    const limit = searchParams.get('_limit');
    const page = searchParams.get('_page');

    if (limit) {
      const limitNum = parseInt(limit);
      const pageNum = page ? parseInt(page) : 1;
      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum;

      cursos = cursos.slice(start, end);
    }

    return NextResponse.json(cursos, {
      headers: {
        'X-Total-Count': String(cursosData.cursos.length),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 },
    );
  }
}
