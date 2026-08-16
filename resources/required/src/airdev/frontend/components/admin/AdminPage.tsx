/* "@airdev/next": "managed" */

import { withError } from '@/airdev/frontend/utils/page';

async function Page() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Tools</h1>
        <p className="text-muted-foreground mt-2">
          Select an option from the header bar to get started
        </p>
      </div>
    </div>
  );
}

const SafePage = withError(Page);
export default SafePage;
