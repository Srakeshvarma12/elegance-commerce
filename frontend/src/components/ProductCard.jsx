export default function ProductCard({ title, price }) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="h-[320px] bg-gray-200"></div>
      <div className="pt-4">
        <p className="text-sm text-gray-500">CLOTHING</p>
        <h3 className="font-serif text-xl">{title}</h3>
        <p className="mt-1">${price}</p>
      </div>
    </div>
  )
}
