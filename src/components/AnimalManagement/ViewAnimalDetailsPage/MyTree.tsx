import FamilyTree from "@balkangraph/familytree.js";
import React, { Component } from "react";


interface ChartProps {
  nodes: any[]; // Replace 'any' with the actual type of 'nodes'
}

// node customization
let [cx, cy] = [0, 0];
let plus = `<circle cx="${cx}" cy="${cy}" r="15" fill="#6D8FB2" stroke="#fff" stroke-width="1"></circle>
    <line x1="-11" y1="0" x2="11" y2="0" stroke-width="1" stroke="#fff"></line>
    <line x1="0" y1="-11" x2="0" y2="11" stroke-width="1" stroke="#fff"></line>`;
let minus = `<circle cx="${cx}" cy="${cy}" r="15" fill="#6D8FB2" stroke="#fff" stroke-width="1"></circle>
    <line x1="-11" y1="0" x2="11" y2="0" stroke-width="1" stroke="#fff"></line>`;

FamilyTree.templates.myTemplate = Object.assign({}, FamilyTree.templates.tommy);

//// Node SIZE, COLOR and SHAPES
FamilyTree.templates.myTemplate.size = [250, 100];
FamilyTree.templates.myTemplate.node = `<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="white" stroke="white" rx="7" ry="7"></rect>
<circle cx="50" cy="50" fill="#039BE5" r="35"></circle>`;
FamilyTree.templates.myTemplate.defs = `<g transform="matrix(1,0,0,1,-12,-9)" id="plus">${minus}</g><g transform="matrix(1,0,0,1,-12,-9)" id="minus">${minus}</g>`;
FamilyTree.templates.myTemplate.field_0 =
  "<text " +
  FamilyTree.attr.width +
  ' ="150" style="font-size: 16px;" fill="#19447E" x="160" y="45" text-anchor="middle">{val}</text>';
FamilyTree.templates.myTemplate.field_1 =
  "<text " +
  FamilyTree.attr.width +
  ' ="230" style="font-size: 14px;" fill="#19447E" x="160" y="70" text-anchor="middle">{val}</text>';
FamilyTree.templates.myTemplate.img_0 = `<clipPath id="ulaImg"><circle cx="50" cy="50" r="35" fill="#248CE6"></circle></clipPath>
  <image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="12" y="10" width="75" height="75"></image>`;
FamilyTree.templates.myTemplate.plus = plus;
FamilyTree.templates.myTemplate.minus = minus;

//// Male and Female templates
FamilyTree.templates.myTemplate_male = Object.assign(
  {},
  FamilyTree.templates.myTemplate
);
FamilyTree.templates.myTemplate_male.node = `<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="white" stroke="#3b82f6" rx="7" ry="7"></rect>
<circle cx="50" cy="50" fill="#3b82f6" r="35"></circle>`;
//   '<circle cx="100" cy="100" r="100" fill="#039be5" stroke-width="1" stroke="#aeaeae"></circle>';
FamilyTree.templates.myTemplate_female = Object.assign(
  {},
  FamilyTree.templates.myTemplate
);
FamilyTree.templates.myTemplate_female.node = `<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="white" stroke="#ec4899" rx="7" ry="7"></rect>
<circle cx="50" cy="50" fill="#ec4899" r="35"></circle>`;
//   '<circle cx="100" cy="100" r="100" fill="#FF46A3" stroke-width="1" stroke="#aeaeae"></circle';

//// Ripple, color, radius and rect
FamilyTree.templates.myTemplate.ripple = {
  radius: 100,
  color: "#e6e6e6",
  rect: undefined,
};
// ripple disable:
// FamilyTree.templates.myTemplate.ripple = {
//     radius: 0,
//     color: "none",
//     rect: undefined
// };

// FamilyTree.templates.myTemplate.nodeMenuButton =
//   '<g style="cursor:pointer;" transform="matrix(1,0,0,1,93,15)" onclick={() => navigate(`/animal/viewanimaldetails/`)}>(...)</g>';

// end node customization

// search placeholder
FamilyTree.SEARCH_PLACEHOLDER = "Search animal";

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
export default class Chart extends Component<ChartProps> {
  private divRef: React.RefObject<HTMLDivElement>;
  private family: FamilyTree | null = null;

  constructor(props: any) {
    super(props);
    this.divRef = React.createRef();

    // this.state = {
    //   family: null,
    // };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    if (this.divRef.current) {
      this.family = new FamilyTree(this.divRef.current, {
        nodes: this.props.nodes as FamilyTreeNodeType[],

        miniMap: true,
        mouseScrool: FamilyTree.none,
        nodeMouseClick: FamilyTree.action.none,
        template: "myTemplate",
        partnerChildrenSplitSeparation: 40,
        levelSeparation: 80,
        nodeBinding: {
          field_0: "name",
          field_1: "animalCode",
          img_0: "img",
        },
      });

      this.family.onNodeDoubleClick((args: any) => {
        let curAnimalCode = args.data.animalCode;
        // console.log(args);
        // window.open(
        //   `http://localhost:5173/animal/viewanimaldetails/${curAnimalCode}`
        // );
        window.location.href = `http://localhost:5173/animal/viewanimaldetails/${curAnimalCode}`;
      });

      // this.family.on("render-link", function (sender, args) {
      //   if (args.cnode.ppid != undefined) {
      //     cx = args.p.xa + 12;
      //     cy = args.p.ya + 9;
      //     args.html += `<use data-ctrl-ec-id="${args.node.id}" xlink:href="#minus" x="${cx}" y="${cy}"/>`;
      //   }
      // });
      // this.family.on("click", function (sender, args) {
      //   var curAnimalCode = args.data["animalCode"];
      //   window.open(
      //     `http://localhost:5173/animal/viewanimaldetails/${curAnimalCode}`
      //   );
      //   return false;
      // });
    }
  }

  render() {
    return <div id="tree" ref={this.divRef}></div>;
  }
}
