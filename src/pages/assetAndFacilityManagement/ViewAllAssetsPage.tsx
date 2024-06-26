import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import AllAnimalFeedDatatable from "../../components/AssetAndFacilityManagement/AssetManagement/AnimalFeed/AllAnimalFeedDatatable";
import AllEnrichmentItemDatatable from "../../components/AssetAndFacilityManagement/AssetManagement/EnrichmentItem/AllEnrichmentItemDatatable";


function ViewAllAssetsPage() {
  const { tab } = useParams<{ tab: string }>();
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
      <span className="self-center text-title-xl font-bold">All Assets</span>
      <Tabs
        defaultValue={tab ? `${tab}` : "animalFeed"}
        className="w-full"
      ><TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
          <TabsTrigger value="animalFeed">Animal Feed</TabsTrigger>
          <TabsTrigger value="enrichmentItem">Enrichment Item</TabsTrigger>
        </TabsList>
        <TabsContent value="animalFeed">
          <AllAnimalFeedDatatable />
        </TabsContent>
        <TabsContent value="enrichmentItem">
          <AllEnrichmentItemDatatable />
        </TabsContent></Tabs>
    </div>
  );
}

export default ViewAllAssetsPage;
