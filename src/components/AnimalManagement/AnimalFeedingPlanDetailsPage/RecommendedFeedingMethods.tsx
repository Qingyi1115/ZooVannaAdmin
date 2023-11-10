import { useEffect, useState } from "react";


import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";

import { AnimalFeedCategory } from "../../../enums/Enumurated";
import SpeciesDietNeed from "../../../models/SpeciesDietNeed";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface RecommendedFeedingMethodsProps {
  speciesCode: string;
}

function RecommendedFeedingMethods(props: RecommendedFeedingMethodsProps) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const { speciesCode } = props;

  const [dietNeedsList, setDietNeedsList] = useState<SpeciesDietNeed[]>([]);
  const [listFeedCategoriesRecommended, setListFeedCategoriesRecommended] =
    useState<string[]>([]);
  const [
    listFeedCategoriesNoRecommendation,
    setListFeedCategoriesNoRecommendation,
  ] = useState<string[]>([]);

  useEffect(() => {
    const fetchDietNeedsList = async () => {
      try {
        if (speciesCode) {
          const responseJson = await apiJson.get(
            `http://localhost:3000/api/species/getAllDietNeedbySpeciesCode/${speciesCode}`
          );
          setDietNeedsList(responseJson as SpeciesDietNeed[]);
          console.log(responseJson as SpeciesDietNeed[]);

          const listAllFeedCategories = Object.keys(AnimalFeedCategory).map(
            (animalFeedCategoryKey) =>
              AnimalFeedCategory[
                animalFeedCategoryKey as keyof typeof AnimalFeedCategory
              ].toString()
          );
          const listRecommendedFeedCategories = (
            responseJson as SpeciesDietNeed[]
          ).map((speciesDietNeed) => {
            return speciesDietNeed.animalFeedCategory.toString();
          });
          const recommendedFeedSet = new Set(listRecommendedFeedCategories);
          // console.log("here");
          // console.log(listRecommendedFeedCategories);
          const listLeftoverFoodCategories = listAllFeedCategories.filter(
            (feedCategory) =>
              !recommendedFeedSet.has(feedCategory) && feedCategory !== "OTHERS"
          );
          // console.log("hereee");
          // console.log(listLeftoverFoodCategories);
          setListFeedCategoriesRecommended([...recommendedFeedSet]);
          setListFeedCategoriesNoRecommendation(listLeftoverFoodCategories);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchDietNeedsList();
  }, []);

  return (
    <div className="h-[35vh] overflow-auto">
      <Table>
        <TableHeader className="sticky">
          <TableRow className="font-medium">
            <TableHead>Growth Stage</TableHead>
            <TableHead>Container</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listFeedCategoriesRecommended.map((feedCategory) => (
            <>
              <TableRow key={feedCategory + "key"}>
                <TableCell colSpan={4}>
                  <div className="flex gap-2">
                    <img
                      className="aspect-square h-5 w-5 rounded-full border border-white object-cover shadow-4"
                      src={`../../../../src/assets/feedCategory/${feedCategory}.jpg`}
                      alt={feedCategory}
                    />{" "}
                    {feedCategory}
                  </div>
                </TableCell>
              </TableRow>
              {dietNeedsList
                .filter((dietNeed) => {
                  //   console.log("beheheh " + feedCategory);
                  //   console.log(dietNeed);
                  //   console.log(
                  //     dietNeed.animalFeedCategory.toString() == feedCategory
                  //   );
                  //   console.log("--------");
                  return dietNeed.animalFeedCategory.toString() == feedCategory;
                })
                .map((dietNeed) => (
                  <>
                    <TableRow key={feedCategory + dietNeed}>
                      <TableCell>{dietNeed.growthStage}</TableCell>
                      <TableCell>
                        {dietNeed.presentationContainer.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        {dietNeed.presentationMethod.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        {dietNeed.presentationLocation.replace(/_/g, " ")}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default RecommendedFeedingMethods;
