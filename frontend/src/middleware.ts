import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Usaremos variables de entorno, o por defecto admin/fortress2026 para testing local
    const validUser = process.env.DASHBOARD_USER || 'admin';
    const validPass = process.env.DASHBOARD_PASS || 'fortress2026';

    if (user === validUser && pwd === validPass) {
      return NextResponse.next();
    }
  }

  // Si no hay auth o es incorrecta, pedimos popup nativo
  return new NextResponse('Autenticación requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Fortress Dashboard"',
    },
  });
}

export const config = {
  // Aplicar solo a la ruta raíz y subrutas
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
