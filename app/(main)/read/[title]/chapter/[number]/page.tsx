import ReaderPage from './read'

interface PageProps {
    params: Promise<{
      title: string;
      number: string;
    }>;
  }

export default async function ({ params } : PageProps) {

    return (
        <ReaderPage params={params}/>
    )
}