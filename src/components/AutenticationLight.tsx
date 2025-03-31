import Image from 'next/image';
import Link from 'next/link';

function AutenticationLight() {
  return (
    <div className="relative dark:z-40 hidden flex-col p-10 lg:flex min-h-screen text-black dark:bg-primary bg-blue-50">
      <div className="absolute inset-0 min-h-screen">
        <div className="absolute inset-0 border-r border-secondary/30 h-full w-full bg-white bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-70"></div>
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(0,153,204,0.25),transparent)]"></div>
        </div>
      </div>
      <Link className="relative z-20 flex items-center font-bold text-2xl text-primary dark:text-white" href="/">
        <Image
          src="/logo_WFS_SP_color.png"
          alt="Logo de WFS"
          className="size-54 mr-4 relative z-40"
          width={120}
          height={120}
        />
      </Link>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2 p-6 rounded-lg bg-white/80 border-l-4 border-secondary shadow-sm">
          <p className="text-xl text-primary font-medium text-pretty dark:text-white">
            Combinamos control de procesos, desarrollo de software y consultoría organizacional para ofrecerte
            soluciones integrales que generan resultados reales.
          </p>
          <footer className="text-md text-secondary font-bold dark:text-secondary">
            WFS
          </footer>
        </blockquote>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary/10 to-transparent"></div>
    </div>
  );
}

export default AutenticationLight;
