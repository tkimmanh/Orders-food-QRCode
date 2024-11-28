import { dishesApiRequest } from "@/apiRequest/dishe";
import CardHome from "@/components/blocks/card-home";
import ButtonBorder from "@/components/button-border";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { path } from "@/constants/type";
import { Link } from "@/navigation";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

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
  const words = ["Quick order", "Easy", "Convenient"];
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center h-full lg:min-h-[500px] min-h-[300px] justify-center flex-col gap-y-4 relative ">
        <p className="font-extrabold text-transparent text-3xl md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {t("title")}
        </p>
        <div className="lg:text-5xl md:text-3xl text-2xl font-extrabold">
          <FlipWords words={words} />
        </div>
        <p className="w-full max-w-[800px] text-center lg:text-base text-sm italic text-slate-400">
          {t("description")}
        </p>
        <div className="flex lg:flex-row items-center justify-center flex-col gap-5">
          <ButtonBorder>{t("subtitle")}</ButtonBorder>
          <Button className="button-scroll">{t("list")}</Button>
        </div>
        <BackgroundBeams />
      </div>
      <div className="border-b w-full pb-4"></div>
      <div className="py-10 w-ful">
        <h1 className="lg:text-3xl text-2xl font-medium mb-10">{t("list")}</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 w-full gap-3">
          {dishesList.map((dish) => (
            <Link key={dish.id} href={`${path.DISHES}/${dish.id}`}>
              <CardHome
                imageUrl={dish.image}
                description={dish.description}
                price={dish.price}
                title={dish.name}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
