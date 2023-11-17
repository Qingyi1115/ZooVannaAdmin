import { useEffect, useState } from "react";
import Enclosure from "../../../models/Enclosure";
import EnclosureEnrichmentItemDatatable from "./EnclosureEnrichmentItemDatatable";

import EnrichmentItem from "../../../models/EnrichmentItem";

import useApiJson from "../../../hooks/useApiJson";

interface EnclosureEnrichmentItemListProps {
  curEnclosure: Enclosure;
}

function EnclosureEnrichmentItemList(props: EnclosureEnrichmentItemListProps) {
  const { curEnclosure } = props;

  const apiJson = useApiJson();

  const [enrichmentItemList, setEnrichmentItemList] = useState<EnrichmentItem[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchEnrichmentItems = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getenrichmentitemsofenclosure/${curEnclosure.enclosureId}`
        );

        setEnrichmentItemList(responseJson.enrichmentItemList as EnrichmentItem[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnrichmentItems();
  }, [refreshSeed]);

  return (
    <div>
      {/* <Button className="mb-4">Add EnrichmentItem</Button> */}
      <EnclosureEnrichmentItemDatatable
        curEnclosure={curEnclosure}
        enrichmentItemList={enrichmentItemList}
        setEnrichmentItemList={setEnrichmentItemList}
        refreshSeed={refreshSeed}
        setRefreshSeed={setRefreshSeed}
      />
    </div>
  );
}

export default EnclosureEnrichmentItemList;
