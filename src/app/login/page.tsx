import RenderBanner from '@/components/RenderBanner';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { LoginButton } from './componentsLogin/LoginButton';

export default async function Login() {
  return (
    <section className="min-h-screen overflow-hidden bg-white dark:bg-primary">
      <div className="container relative flex-col grid-cols-1 justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0  md:px-2 p-0">
        <RenderBanner />
        <div className="lg:p-8 relative z-50 md:p-8 pt-7 p-0 flex flex-col justify-center items-center w-full">
          <Link className="relative z-20 lg:hidden items-center font-bold text-2xl flex text-primary" href="/">
            <Image
              src="/logo_WFS_SP_color.png"
              alt="Logo de WFS"
              className="size-12 mr-4"
              width={120}
              height={120}
            />
            WFS SP - Gestion
          </Link>
          <div className="w-full overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold tracking-tight lg:text-left text-center text-primary dark:text-white">
                ¡Bienvenido al portal de gestion de WFS SP!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-8 flex flex-col w-full">
                <div className="w-full space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    Email
                  </Label>
                  <Input
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    id="email"
                    name="email"
                    type="email"
                    className="text-lg"
                  />
                  <CardDescription className="text-lg" id="email_error">
                    Por favor ingresa tu correo.
                  </CardDescription>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-lg">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="mi contraseña segura"
                    className="text-lg"
                    autoComplete="current-password"
                  />
                  <CardDescription className="text-lg" id="password_error">
                    Por favor ingresa tu contraseña.
                  </CardDescription>
                </div>
                <div className="flex w-full justify-center flex-col items-center gap-2">
                  <LoginButton />
                  {/* <Link href="/register" className="text-md">
                    ¿No tienes una cuenta? <span className="text-secondary ml-1 ">Créate una aquí</span>
                  </Link> */}
                </div>
                <Separator orientation="horizontal" className="my-2 w-[70%] self-center bg-secondary/50" />
                {/* <Link href="/reset_password" className="text-md m-auto">
                  ¿Olvidaste tu contraseña? <span className="text-secondary ml-1 ">restablecela aquí </span>
                </Link> */}
                {/* <GoogleButton /> */}
              </form>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  );
}
