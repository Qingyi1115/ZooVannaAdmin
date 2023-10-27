import React, { useState, useEffect, useMemo } from "react";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Animal from "../../models/Animal";
import Species from "../../models/Species";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";
import AnimalBasicInformation from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalBasicInformation";
import AnimalWeightInfo from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalWeightInfo";
import FamilyTree from "../../components/AnimalManagement/ViewAnimalDetailsPage/MyTree";
import { clone } from "chart.js/dist/helpers/helpers.core";

import { ImSpinner2 } from "react-icons/im";

let testJson = {
  age: 2,
  animalId: 1,
  animalCode: "ANM00001",
  isGroup: false,
  houseName: "Pang Pang",
  sex: "FEMALE",
  dateOfBirth: "2021-03-04T00:00:00.000Z",
  placeOfBirth: "Singapore",
  identifierType: "TYPE",
  identifierValue: "identifierValue 001",
  acquisitionMethod: "CAPTIVE_BRED",
  dateOfAcquisition: "2021-03-04T00:00:00.000Z",
  acquisitionRemarks: "N.A.",
  physicalDefiningCharacteristics: "Big face, black spot at the back",
  behavioralDefiningCharacteristics: "active, friendly",
  dateOfDeath: null,
  locationOfDeath: null,
  causeOfDeath: null,
  growthStage: "UNKNOWN",
  animalStatus: "NORMAL",
  imageUrl: "img/animal/pangPang.jpg",
  createdAt: "2023-10-03T14:51:17.000Z",
  updateTimestamp: "2023-10-03T14:51:17.000Z",
  speciesSpeciesId: 1,
  enclosureId: null,
  children: [],
  parents: [
    {
      age: null,
      animalId: 2,
      animalCode: "ANM00002",
      isGroup: true,
      houseName: "Panda Group 01",
      sex: "MALE",
      dateOfBirth: null,
      placeOfBirth: null,
      identifierType: null,
      identifierValue: null,
      acquisitionMethod: "WILD_CAPTURED",
      dateOfAcquisition: "2021-03-04T00:00:00.000Z",
      acquisitionRemarks: null,
      physicalDefiningCharacteristics: null,
      behavioralDefiningCharacteristics: null,
      dateOfDeath: null,
      locationOfDeath: null,
      causeOfDeath: null,
      growthStage: "UNKNOWN",
      animalStatus: "NORMAL",
      imageUrl: "img/animal/pandaGroup01.jpg",
      createdAt: "2023-10-03T14:51:17.000Z",
      updateTimestamp: "2023-10-03T14:51:17.000Z",
      speciesSpeciesId: 1,
      enclosureId: null,
      parent_child: {
        createdAt: "2023-10-03T14:51:34.000Z",
        updateTimestamp: "2023-10-03T14:51:34.000Z",
        parentId: 1,
        childId: 2,
      },
      parents: [
        {
          age: 2,
          animalId: 3,
          animalCode: "ANM00003",
          isGroup: true,
          houseName: "Panda 3",
          sex: "FEMALE",
          dateOfBirth: "2021-03-04T00:00:00.000Z",
          placeOfBirth: "Singapore",
          identifierType: "TYPE",
          identifierValue: "identifierValue 001",
          acquisitionMethod: "CAPTIVE_BRED",
          dateOfAcquisition: "2021-03-04T00:00:00.000Z",
          acquisitionRemarks: "N.A.",
          physicalDefiningCharacteristics: "Big face, black spot at the back",
          behavioralDefiningCharacteristics: "active, friendly",
          dateOfDeath: null,
          locationOfDeath: null,
          causeOfDeath: null,
          growthStage: "UNKNOWN",
          animalStatus: "NORMAL",
          imageUrl: "img/animal/pangPang.jpg",
          createdAt: "2023-10-03T14:51:17.000Z",
          updateTimestamp: "2023-10-03T14:51:17.000Z",
          speciesSpeciesId: 1,
          enclosureId: null,
          parent_child: {
            createdAt: "2023-10-03T14:51:39.000Z",
            updateTimestamp: "2023-10-03T14:51:39.000Z",
            parentId: 2,
            childId: 3,
          },
          parents: [],
        },
        {
          age: 2,
          animalId: 4,
          animalCode: "ANM00004",
          isGroup: true,
          houseName: "Panda 4",
          sex: "MALE",
          dateOfBirth: "2021-03-04T00:00:00.000Z",
          placeOfBirth: "Singapore",
          identifierType: "TYPE",
          identifierValue: "identifierValue 001",
          acquisitionMethod: "CAPTIVE_BRED",
          dateOfAcquisition: "2021-03-04T00:00:00.000Z",
          acquisitionRemarks: "N.A.",
          physicalDefiningCharacteristics: "Big face, black spot at the back",
          behavioralDefiningCharacteristics: "active, friendly",
          dateOfDeath: null,
          locationOfDeath: null,
          causeOfDeath: null,
          growthStage: "UNKNOWN",
          animalStatus: "NORMAL",
          imageUrl: "img/animal/pangPang.jpg",
          createdAt: "2023-10-03T14:51:17.000Z",
          updateTimestamp: "2023-10-03T14:51:17.000Z",
          speciesSpeciesId: 1,
          enclosureId: null,
          parent_child: {
            createdAt: "2023-10-03T14:51:39.000Z",
            updateTimestamp: "2023-10-03T14:51:39.000Z",
            parentId: 2,
            childId: 3,
          },
          parents: [],
        },
      ],
    },
  ],
};

function ViewAnimalFullLineage() {
  const apiJson = useApiJson();
  const { animalCode } = useParams<{ animalCode: string }>();

  const [curAnimalLineage, setCurAnimalLineage] = useState<any>(null);
  const [familyTreeNodes, setFamilyTreeNodes] = useState<any[]>([]);
  let tempNodesOutside: any[] = [];
  const [isLineageRetrieved, setIsLineageRetrieved] = useState<boolean>(false);

  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchLineageByAnimalCode = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getLineageByAnimalCode/${animalCode}`
        );
        setCurAnimalLineage(responseJson as Animal);
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchLineageByAnimalCode();
  }, []);

  // process animal and add them to the nodes list
  function updateOrAddNode(newNode: any, nodes: any[]): void {
    const index = nodes.findIndex((node) => node.id === newNode.id);

    if (index === -1) {
      // Node doesn't exist, add it
      nodes.push(newNode);
    } else {
      // Node already exists, update it
      const existingNode = nodes[index];

      // Merge pids arrays
      existingNode.pids = [...new Set(existingNode.pids.concat(newNode.pids))];

      // Update mid and fid if necessary
      if (newNode.mid !== "" && existingNode.mid === "") {
        existingNode.mid = newNode.mid;
      }
      if (newNode.fid !== "" && existingNode.fid === "") {
        existingNode.fid = newNode.fid;
      }
    }
  }

  function addPidsBetweenParents(
    parent1Id: number,
    parent2Id: number,
    nodes: any[]
  ): void {
    const parent1 = nodes.find((node) => node.id === parent1Id);
    const parent2 = nodes.find((node) => node.id === parent2Id);

    if (parent1 && !parent1.pids.includes(parent2Id)) {
      parent1.pids.push(parent2Id);
    }

    if (parent2 && !parent2.pids.includes(parent1Id)) {
      parent2.pids.push(parent1Id);
    }
  }

  interface FamilyTreeNodeType {
    id: number;
    mid: null | number;
    fid: null | number;
    pids: [];
    name: string;
    animalCode: string;
    gender: string;
    img: string;
  }

  function removeAnimalFromParentsChildren(animal: Animal, parent: Animal) {
    // // Remove the current animal from the parent's children array
    if (parent && parent.children) {
      parent.children = parent.children.filter(
        (child) => child.animalId !== animal.animalId
      );
    }
  }

  function removeAnimalFromChildrenParents(animal: Animal, child: Animal) {
    // // Remove the current animal from the child's parents array
    // if (child && child.parents) {
    //   child.parents = child.parents.filter(
    //     (parent) => parent.animalId !== animal.animalId
    //   );
    // }

    if (child && child.parents && child.parents.length === 2) {
      const parent1Id = child.parents[0].animalId;
      const parent2Id = child.parents[1].animalId;

      // Check if both parent IDs are inside each other's pids
      const parent1 = tempNodesOutside.find((node) => node.id === parent1Id);
      const parent2 = tempNodesOutside.find((node) => node.id === parent2Id);

      if (
        parent1 &&
        parent2 &&
        parent1.pids.includes(parent2Id) &&
        parent2.pids.includes(parent1Id)
      ) {
        // Both parents are inside each other's pids, remove the current animal from the child's parents array
        child.parents = child.parents.filter(
          (parent) => parent.animalId !== animal.animalId
        );
      }
    } else if (child && child.parents && child.parents.length === 1) {
      // If child has only one parent, remove it if it is already inside tempNodesOutside
      const parent1Id = child.parents[0].animalId;
      if (tempNodesOutside.some((node) => node.id === parent1Id)) {
        child.parents = [];
      }
    }
  }

  function processAnimal(animal: Animal) {
    if (!animal) {
      return;
    }
    console.log("HERE");
    console.log("animal houseName:" + animal.houseName);
    // Process the parents
    if (animal.parents) {
      for (const parent of animal.parents) {
        removeAnimalFromParentsChildren(animal, parent);
        processAnimal(parent);
      }
    }

    //// ACTUAL PROCESSING ////
    let tempNodes = [...tempNodesOutside];
    // Initialise node attributes
    let curAnimalNode: FamilyTreeNodeType = {
      id: animal.animalId,
      mid: null,
      fid: null,
      pids: [],
      name: animal.houseName,
      animalCode: animal.animalCode,
      gender: animal.sex?.toLowerCase() || "",
      img: `http://localhost:3000/${animal.imageUrl}`,
    };

    // If parents.length == 2,
    if (animal.parents && animal.parents.length == 2) {
      const parent1 = animal.parents[0];
      const parent2 = animal.parents[1];

      addPidsBetweenParents(parent1.animalId, parent2.animalId, tempNodes);
      // add parent1's id to parent2's list of pids INSIDE THE NODE IN THE LIST, ONLY IF IT IS NOT IN ALREADY
      // add parent2's id to parent1's list of pids INSIDE THE NODE IN THE LIST, ONLY IF IT IS NOT IN ALREADY
      // parent1.sex == "FEMALE"
      //   ? (curAnimalNode.mid = parent1.animalId)
      //   : (curAnimalNode.fid = parent1.animalId);
      // parent2.sex == "FEMALE"
      //   ? (curAnimalNode.mid = parent2.animalId)
      //   : (curAnimalNode.fid = parent2.animalId);

      // just dump the parent ids in
      curAnimalNode.mid = parent1.animalId;
      curAnimalNode.fid = parent2.animalId;
    } else if (animal.parents && animal.parents.length == 1) {
      const parent1 = animal.parents[0];
      parent1.sex == "FEMALE"
        ? (curAnimalNode.mid = parent1.animalId)
        : (curAnimalNode.fid = parent1.animalId);
    }

    // add to familyTreeNodes
    updateOrAddNode(curAnimalNode, tempNodes);
    // setFamilyTreeNodes([...tempNodes]);
    tempNodesOutside = [...tempNodes];

    // Process the children
    if (animal.children) {
      for (const child of animal.children) {
        if (!child.parents) {
          let curChildNode: FamilyTreeNodeType = {
            id: child.animalId,
            mid: null,
            fid: null,
            pids: [],
            name: child.houseName,
            animalCode: child.animalCode,
            gender: child.sex?.toLowerCase() || "",
            img: `http://localhost:3000/${child.imageUrl}`,
          };
          animal.sex == "FEMALE"
            ? (curChildNode.mid = animal.animalId)
            : (curChildNode.fid = animal.animalId);
          updateOrAddNode(curChildNode, tempNodes);
          tempNodesOutside = [...tempNodes];
        }
        // removeAnimalFromChildrenParents(animal, child);
        processAnimal(child);
      }
    }
  }

  useEffect(() => {
    if (curAnimalLineage) {
      processAnimal(curAnimalLineage);
      if (tempNodesOutside.length != 0) {
        setFamilyTreeNodes(tempNodesOutside);
        setIsLineageRetrieved(true);
      }
    }
    console.log("family tree!");
    console.log(tempNodesOutside);

    // fetchAnimalsBySpecies();
  }, [refreshSeed]);

  // end family tree nodes stuff

  // edit search box text
  function changeSearchBoxText() {
    const treeDiv = document.getElementById("tree");

    if (treeDiv) {
      // Find the label element within the div
      const labelElement = treeDiv.querySelector("label");

      if (labelElement) {
        labelElement.textContent = "New Text Here";
      }
    }
  }
  // useEffect(() => {
  //   changeSearchBoxText();
  // });

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink
              className="flex"
              to={`/animal/viewanimaldetails/${animalCode}`}
            >
              <Button variant={"outline"} type="button" className="">
                Back
              </Button>
            </NavLink>
            <span className="self-center text-lg text-graydark">
              Animal Lineage
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curAnimalLineage ? <div>{curAnimalLineage.houseName}</div> : ""}
          </span>
          <span className="self-center">
            {curAnimalLineage && (
              <span>
                (Relatives Included Up to Three Degrees from{" "}
                {curAnimalLineage.houseName})
              </span>
            )}
          </span>
        </div>
        {/*  */}
        <div className="overflow-hidden rounded-md border border-strokedark/20">
          {isLineageRetrieved && curAnimalLineage ? (
            <FamilyTree nodes={familyTreeNodes} />
          ) : (
            <div className="flex items-center justify-center p-10 text-lg">
              <ImSpinner2 className="mr-3 h-5 w-5 animate-spin" /> Family Tree
              is loading
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAnimalFullLineage;
