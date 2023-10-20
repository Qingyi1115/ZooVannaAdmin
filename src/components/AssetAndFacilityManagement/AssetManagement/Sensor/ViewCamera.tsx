import React, { useEffect, useRef, useState } from "react";
import * as Form from "@radix-ui/react-form";

import { MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../../hooks/useApiFormData";
import FormFieldInput from "../../../FormFieldInput";
import Sensor from "../../../../models/Sensor";
import useApiJson from "../../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import FormFieldSelect from "../../../FormFieldSelect";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Authorization {
    authorization : any;
}

function ViewCamera(props: Authorization) {

    const [pageContent, setPageContent] = useState<any>(undefined);
    const { authorization } = props;
    const url = "http://" + authorization.ipAddressName + ":8000";


    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
   
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(url);
          if (!response.ok || !response.body) {
            throw response.statusText;
          }
   
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
   
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              setLoading(false);
              break;
            }
   
            const decodedChunk = decoder.decode(value, { stream: true });
            setData(prevValue => `${prevValue}${decodedChunk}`);
          }
        } catch (error) {
          setLoading(false);
          // Handle other errors
        }
      };
   
      fetchData();
    }, []);
   
    return (

      <div className="w-[100vw] h-[100vh]">
      <iframe className="w-[100vw] h-[100vh]" src={url}></iframe>
    </div>
    );
}

export default ViewCamera;
