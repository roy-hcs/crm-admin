import { useTabNavigation } from '../hooks/useTabNavigation';

export function ExamplePage() {
  // This will add this page to the tabs when it's visited
  useTabNavigation({
    title: 'Example Page',
    path: '/example',
    closable: true,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Example Page</h1>
      <p>This page content will be cached when you navigate away and restored when you return.</p>

      {/* Example of content that will be preserved */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" className="mt-1 block w-full rounded-md border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="mt-1 block w-full rounded-md border p-2" />
        </div>
      </form>
    </div>
  );
}
