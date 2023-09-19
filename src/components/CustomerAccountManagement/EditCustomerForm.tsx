import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../hooks/useApiFormData";
import FormFieldInput from "../FormFieldInput";
import FormFieldRadioGroup from "../FormFieldRadioGroup";
import Customer from "src/models/Customer";
import FormFieldSelect from "../FormFieldSelect";

interface EditCustomerFormProps {
  curCustomer: Customer;
}

function EditCustomerForm(props: EditCustomerFormProps) {
  const apiFormData = useApiFormData();

  const { curCustomer } = props;

  const [firstName, setFirstName] = useState<string>(curCustomer.firstName);
  const [lastName, setLastName] = useState<string>(curCustomer.lastName);
  const [email, setEmail] = useState<string>(curCustomer.email);
  const [contactNo, setContactNo] = useState<string>(curCustomer.contactNo);
  const [birthday, setBirthday] = useState<Date>(curCustomer.birthday);
  const [address, setAddress] = useState<string>(curCustomer.address);
  const [nationality, setNationality] = useState<
    string | undefined
  >(curCustomer.nationality); // select from set list
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  // field validations
  function validateImage(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please upload an image
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function validateName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">
            * Please enter a valid value
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  function clearForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setContactNo("");
    setBirthday(new Date());
    setAddress("");
    setNationality(undefined);
    setImageFile(null);
  }


  function validateNationality(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (nationality == undefined) {
        return (
          <div className="font-medium text-danger">
            * Please select a country
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }

  // end field valisations

  function onNationalitySelectChange(e: MultiSelectChangeEvent) {
    setNationality(e.value);

    const element = document.getElementById("selectMultiNationalityField");
    if (element) {
      const isDataInvalid = element.getAttribute("data-invalid");
      if (isDataInvalid == "true") {
        element.setAttribute("data-valid", "true");
        element.removeAttribute("data-invalid");
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("contactNo", contactNo);
    formData.append("birthday", birthday?.toString() || "");
    formData.append("address", address);
    formData.append("nationality", nationality?.toString() || "");
    formData.append("file", imageFile || "");
    await apiFormData.put(
      "http://localhost:3000/api/customer/updatecustomer",
      formData
    );
    console.log(apiFormData.result);
  }

  return (
    <div>
      {curCustomer && (
        <Form.Root
          className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <span className="self-center text-title-xl font-bold">
            Edit Customer: {curCustomer.firstName + " " + curCustomer.lastName}
          </span>
          <hr className="bg-stroke opacity-20" />
          {/* Customer Picture */}
          <Form.Field
            name="customerImage"
            className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
          >
            <span className="font-medium">Current Image</span>
            {/* <img src={curCustomer.customerImageUrl} alt="Current customer image" /> */}
            <Form.Label className="font-medium">
              Change Profile Picture
            </Form.Label>
            <Form.Control
              type="file"
              placeholder="Change image"
              required
              accept=".png, .jpg, .jpeg, .webp"
              onChange={handleFileChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            <Form.ValidityState>{validateImage}</Form.ValidityState>
          </Form.Field>
          <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
            {/* First Name */}
            <FormFieldInput
              type="text"
              formFieldName="firstName"
              label="First Name"
              required={true}
              placeholder="First Name"
              value={firstName}
              setValue={setFirstName}
              validateFunction={validateName}
            />
            {/* Last Name */}
            <FormFieldInput
              type="text"
              formFieldName="lastName"
              label="Last Name"
              required={true}
              placeholder="Last Name"
              value={lastName}
              setValue={setLastName}
              validateFunction={validateName}
            />
            {/* Email */}
            <FormFieldInput
              type="text"
              formFieldName="email"
              label="Email"
              required={true}
              placeholder="Email"
              value={email}
              setValue={setEmail}
              validateFunction={validateName}
            />
            {/* Contact Number */}
            <FormFieldInput
              type="text"
              formFieldName="lastName"
              label="Contact Number"
              required={true}
              placeholder="Contact Number"
              value={contactNo}
              setValue={setContactNo}
              validateFunction={validateName}
            />
            {/* Birthday */}
            <FormFieldInput
              type="text"
              formFieldName="lastName"
              label="Birthday"
              required={true}
              placeholder="Birthday"
              value={birthday.toString()}
              setValue={setBirthday.toString}
              validateFunction={validateName}
            />
            {/* Address */}
            <FormFieldInput
              type="text"
              formFieldName="lastName"
              label="Address"
              required={true}
              placeholder="Address"
              value={address}
              setValue={setAddress}
              validateFunction={validateName}
            />
            <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
              {/* Nationality */}
              <FormFieldSelect
                formFieldName="nationality"
                label="Nationality"
                required={true}
                placeholder="Select a nationality..."
                valueLabelPair={[
                  ["AF", "Afghanistan"],
                  ["AX", "AlandIslands"],
                  ["AL", "Albania"],
                  ["DZ", "Algeria"],
                  ["AS", "AmericanSamoa"],
                  ["AD", "Andorra"],
                  ["AO", "Angola"],
                  ["AI", "Anguilla"],
                  ["AQ", "Antarctica"],
                  ["AG", "AntiguaAndBarbuda"],
                  ["AR", "Argentina"],
                  ["AM", "Armenia"],
                  ["AW", "Aruba"],
                  ["AU", "Australia"],
                  ["AT", "Austria"],
                  ["AZ", "Azerbaijan"],
                  ["BS", "Bahamas"],
                  ["BH", "Bahrain"],
                  ["BD", "Bangladesh"],
                  ["BB", "Barbados"],
                  ["BY", "Belarus"],
                  ["BE", "Belgium"],
                  ["BZ", "Belize"],
                  ["BJ", "Benin"],
                  ["BM", "Bermuda"],
                  ["BT", "Bhutan"],
                  ["BO", "Bolivia"],
                  ["BQ", "BonaireSintEustatiusSaba"],
                  ["BA", "BosniaAndHerzegovina"],
                  ["BW", "Botswana"],
                  ["BV", "BouvetIsland"],
                  ["BR", "Brazil"],
                  ["IO", "BritishIndianOceanTerritory"],
                  ["BN", "BruneiDarussalam"],
                  ["BG", "Bulgaria"],
                  ["BF", "BurkinaFaso"],
                  ["BI", "Burundi"],
                  ["KH", "Cambodia"],
                  ["CM", "Cameroon"],
                  ["CA", "Canada"],
                  ["CV", "CapeVerde"],
                  ["KY", "CaymanIslands"],
                  ["CF", "CentralAfricanRepublic"],
                  ["TD", "Chad"],
                  ["CL", "Chile"],
                  ["CN", "China"],
                  ["CX", "ChristmasIsland"],
                  ["CC", "CocosKeelingIslands"],
                  ["CO", "Colombia"],
                  ["KM", "Comoros"],
                  ["CG", "Congo"],
                  ["CD", "CongoDemocraticRepublic"],
                  ["CK", "CookIslands"],
                  ["CR", "CostaRica"],
                  ["CI", "CoteDIvoire"],
                  ["HR", "Croatia"],
                  ["CU", "Cuba"],
                  ["CW", "Curaçao"],
                  ["CY", "Cyprus"],
                  ["CZ", "CzechRepublic"],
                  ["DK", "Denmark"],
                  ["DJ", "Djibouti"],
                  ["DM", "Dominica"],
                  ["DO", "DominicanRepublic"],
                  ["EC", "Ecuador"],
                  ["EG", "Egypt"],
                  ["SV", "ElSalvador"],
                  ["GQ", "EquatorialGuinea"],
                  ["ER", "Eritrea"],
                  ["EE", "Estonia"],
                  ["ET", "Ethiopia"],
                  ["FK", "FalklandIslands"],
                  ["FO", "FaroeIslands"],
                  ["FJ", "Fiji"],
                  ["FI", "Finland"],
                  ["FR", "France"],
                  ["GF", "FrenchGuiana"],
                  ["PF", "FrenchPolynesia"],
                  ["TF", "FrenchSouthernTerritories"],
                  ["GA", "Gabon"],
                  ["GM", "Gambia"],
                  ["GE", "Georgia"],
                  ["DE", "Germany"],
                  ["GH", "Ghana"],
                  ["GI", "Gibraltar"],
                  ["GR", "Greece"],
                  ["GL", "Greenland"],
                  ["GD", "Grenada"],
                  ["GP", "Guadeloupe"],
                  ["GU", "Guam"],
                  ["GT", "Guatemala"],
                  ["GG", "Guernsey"],
                  ["GN", "Guinea"],
                  ["GW", "GuineaBissau"],
                  ["GY", "Guyana"],
                  ["HT", "Haiti"],
                  ["HM", "HeardIslandMcdonaldIslands"],
                  ["VA", "HolySeeVaticanCityState"],
                  ["HN", "Honduras"],
                  ["HK", "HongKong"],
                  ["HU", "Hungary"],
                  ["IS", "Iceland"],
                  ["IN", "India"],
                  ["ID", "Indonesia"],
                  ["IR", "Iran"],
                  ["IQ", "Iraq"],
                  ["IE", "Ireland"],
                  ["IM", "IsleOfMan"],
                  ["IL", "Israel"],
                  ["IT", "Italy"],
                  ["JM", "Jamaica"],
                  ["JP", "Japan"],
                  ["JE", "Jersey"],
                  ["JO", "Jordan"],
                  ["KZ", "Kazakhstan"],
                  ["KE", "Kenya"],
                  ["KI", "Kiribati"],
                  ["KR", "Korea"],
                  ["KP", "KoreaDemocraticPeoplesRepublic"],
                  ["KW", "Kuwait"],
                  ["KG", "Kyrgyzstan"],
                  ["LA", "LaoPeoplesDemocraticRepublic"],
                  ["LV", "Latvia"],
                  ["LB", "Lebanon"],
                  ["LS", "Lesotho"],
                  ["LR", "Liberia"],
                  ["LY", "LibyanArabJamahiriya"],
                  ["LI", "Liechtenstein"],
                  ["LT", "Lithuania"],
                  ["LU", "Luxembourg"],
                  ["MO", "Macao"],
                  ["MK", "Macedonia"],
                  ["MG", "Madagascar"],
                  ["MW", "Malawi"],
                  ["MY", "Malaysia"],
                  ["MV", "Maldives"],
                  ["ML", "Mali"],
                  ["MT", "Malta"],
                  ["MH", "MarshallIslands"],
                  ["MQ", "Martinique"],
                  ["MR", "Mauritania"],
                  ["MU", "Mauritius"],
                  ["YT", "Mayotte"],
                  ["MX", "Mexico"],
                  ["FM", "Micronesia"],
                  ["MD", "Moldova"],
                  ["MC", "Monaco"],
                  ["MN", "Mongolia"],
                  ["ME", "Montenegro"],
                  ["MS", "Montserrat"],
                  ["MA", "Morocco"],
                  ["MZ", "Mozambique"],
                  ["MM", "Myanmar"],
                  ["NA", "Namibia"],
                  ["NR", "Nauru"],
                  ["NP", "Nepal"],
                  ["NL", "Netherlands"],
                  ["NC", "NewCaledonia"],
                  ["NZ", "NewZealand"],
                  ["NI", "Nicaragua"],
                  ["NE", "Niger"],
                  ["NG", "Nigeria"],
                  ["NU", "Niue"],
                  ["NF", "NorfolkIsland"],
                  ["MP", "NorthernMarianaIslands"],
                  ["NO", "Norway"],
                  ["OM", "Oman"],
                  ["PK", "Pakistan"],
                  ["PW", "Palau"],
                  ["PS", "PalestinianTerritory"],
                  ["PA", "Panama"],
                  ["PG", "PapuaNewGuinea"],
                  ["PY", "Paraguay"],
                  ["PE", "Peru"],
                  ["PH", "Philippines"],
                  ["PN", "Pitcairn"],
                  ["PL", "Poland"],
                  ["PT", "Portugal"],
                  ["PR", "PuertoRico"],
                  ["QA", "Qatar"],
                  ["RE", "Reunion"],
                  ["RO", "Romania"],
                  ["RU", "RussianFederation"],
                  ["RW", "Rwanda"],
                  ["BL", "SaintBarthelemy"],
                  ["SH", "SaintHelena"],
                  ["KN", "SaintKittsAndNevis"],
                  ["LC", "SaintLucia"],
                  ["MF", "SaintMartin"],
                  ["PM", "SaintPierreAndMiquelon"],
                  ["VC", "SaintVincentAndGrenadines"],
                  ["WS", "Samoa"],
                  ["SM", "SanMarino"],
                  ["ST", "SaoTomeAndPrincipe"],
                  ["SA", "SaudiArabia"],
                  ["SN", "Senegal"],
                  ["RS", "Serbia"],
                  ["SC", "Seychelles"],
                  ["SL", "SierraLeone"],
                  ["SG", "Singapore"],
                  ["SX", "SintMaarten"],
                  ["SK", "Slovakia"],
                  ["SI", "Slovenia"],
                  ["SB", "SolomonIslands"],
                  ["SO", "Somalia"],
                  ["ZA", "SouthAfrica"],
                  ["GS", "SouthGeorgiaAndSandwichIsl"],
                  ["SS", "SouthSudan"],
                  ["ES", "Spain"],
                  ["LK", "SriLanka"],
                  ["SD", "Sudan"],
                  ["SR", "Suriname"],
                  ["SJ", "SvalbardAndJanMayen"],
                  ["SZ", "Swaziland"],
                  ["SE", "Sweden"],
                  ["CH", "Switzerland"],
                  ["SY", "SyrianArabRepublic"],
                  ["TW", "Taiwan"],
                  ["TJ", "Tajikistan"],
                  ["TZ", "Tanzania"],
                  ["TH", "Thailand"],
                  ["TL", "TimorLeste"],
                  ["TG", "Togo"],
                  ["TK", "Tokelau"],
                  ["TO", "Tonga"],
                  ["TT", "TrinidadAndTobago"],
                  ["TN", "Tunisia"],
                  ["TR", "Turkey"],
                  ["TM", "Turkmenistan"],
                  ["TC", "TurksAndCaicosIslands"],
                  ["TV", "Tuvalu"],
                  ["UG", "Uganda"],
                  ["UA", "Ukraine"],
                  ["AE", "UnitedArabEmirates"],
                  ["GB", "UnitedKingdom"],
                  ["US", "UnitedStates"],
                  ["UM", "UnitedStatesOutlyingIslands"],
                  ["UY", "Uruguay"],
                  ["UZ", "Uzbekistan"],
                  ["VU", "Vanuatu"],
                  ["VE", "Venezuela"],
                  ["VN", "Vietnam"],
                  ["VG", "VirginIslandsBritish"],
                  ["VI", "VirginIslandsUS"],
                  ["WF", "WallisAndFutuna"],
                  ["EH", "WesternSahara"],
                  ["YE", "Yemen"],
                  ["ZM", "Zambia"],
                  ["ZW", "Zimbabwe"]
                ]}
                value={nationality}
                setValue={setNationality}
                validateFunction={validateNationality}
              />
            </div>

            <Form.Submit asChild>
              <button className="mt-10 h-12 w-2/3 self-center rounded-full border bg-primary text-lg text-whiten transition-all hover:bg-opacity-80">
                Submit Edit Customer
              </button>
            </Form.Submit>
            {formError && (
              <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
            )}
          </div>
        </Form.Root>
      )}
    </div>
  );
}

export default EditCustomerForm;
