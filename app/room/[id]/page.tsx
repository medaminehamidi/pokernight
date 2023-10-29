import RoomForm from "@/components/roomform";

export default function Home({ params }: { params: { id: number } }) {
  const { id } = params
  return (
    <div className="flex min-h-[90vh] items-start justify-center p-6 mb-5">
      <RoomForm id={id} />
    </div>
  )
}