import PdfEditor from "@/components/PdfEditor";

const EditorPage = async ({ params }: { params: { docId: string } }) => {
  return (
    <section className="h-[calc(100vh-2rem)] p-4">
      <PdfEditor docId={params.docId} />
    </section>
  );
};

export default EditorPage;
