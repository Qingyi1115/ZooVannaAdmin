import React, { useEffect, useState } from "react";
import Species from "../../../models/Species";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

interface SpeciesCardProps {
  curSpecies: Species;
}

function SpeciesCard(props: SpeciesCardProps) {
  const { curSpecies } = props;
  return (
    <NavLink to={`/species/viewspeciesdetails/${curSpecies.speciesCode}`}>
      <Card className=" w-full transition-all hover:bg-secondary/70">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img
              alt={curSpecies?.commonName}
              src={"http://localhost:3000/" + curSpecies?.imageUrl}
              className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
            />
            <div>
              <div className="text-lg font-bold">{curSpecies.commonName}</div>
              <div>{curSpecies.scientificName}</div>
            </div>
            <div className="ml-auto flex items-center">
              Click to view details <HiChevronRight className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </NavLink>
  );
}

export default SpeciesCard;
