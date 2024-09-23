import { dishesApiRequest } from "@/apiRequest/dishe";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/navigation";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  let dishesList: DishListResType["data"] = [];
  try {
    const result = await dishesApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishesList = data;
  } catch (error) {
    return <div>Something went wrong</div>;
  }
  unstable_setRequestLocale(locale);
  // với async function sử dụng i18n thì sử dụng phương thức getTranslations() để lấy dữ liệu ngôn ngữ
  const t = await getTranslations("HomePage");

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src="https://plus.unsplash.com/premium_photo-1675103909152-4aa4efcb5598?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={400}
          height={200}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            Nhà hàng {t("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            Vị ngon, trọn khoảnh khắc
          </p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishesList.map((dish) => (
            <Link
              href={`/dishes/${dish.id}`}
              className="flex gap-4 w"
              key={dish.id}
            >
              <div className="flex-shrink-0">
                <Image
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={100}
                  alt={dish.name}
                  className="object-cover w-[150px] h-[150px] rounded-md"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <p className="">{dish.description}</p>
                <p className="font-semibold">{formatCurrency(dish.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
