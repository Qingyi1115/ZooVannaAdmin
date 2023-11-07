import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";

interface Authorization {
  authorization: any;
}

function ViewCameraFeeds(props: Authorization) {

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
    <div className="flex justify-between self-center gap-6">
      <div className="flex flex-row gap-6">

        <Accordion multiple activeIndex={[0, 1, 2]}>
          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 1</div>
            </div>
          </AccordionTab>
          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 2</div>
            </div>
          </AccordionTab>

          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 3</div>
            </div>
          </AccordionTab>
        </Accordion>

        <Accordion multiple activeIndex={[0, 1, 2]}>
          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 1</div>
            </div>
          </AccordionTab>
          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 2</div>
            </div>
          </AccordionTab>

          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 3</div>
            </div>
          </AccordionTab>
        </Accordion>

        <Accordion multiple activeIndex={[0, 1, 2]}>
          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 1</div>
            </div>
          </AccordionTab>
          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 2</div>
            </div>
          </AccordionTab>

          <AccordionTab header="Camera 1" >
            <div className="w-full h-full">
              <iframe className="w-full h-full" src={url}></iframe>
              <div className="mb-1 block font-medium">Camera 3</div>
            </div>
          </AccordionTab>
        </Accordion>

      </div>
    </div>

    // <div className="w-[100vw] h-[100vh]">
    //   <iframe className="w-[100vw] h-[100vh]" src={url}></iframe>
    // </div>
  );
}

export default ViewCameraFeeds;
