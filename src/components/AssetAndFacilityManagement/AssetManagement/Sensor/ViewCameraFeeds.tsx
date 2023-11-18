import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";

interface Authorization {
  authorizations: any;
}

function ViewCameraFeeds(props: Authorization) {

  const [pageContent, setPageContent] = useState<any>(undefined);
  const { authorizations } = props;
  const [urls, setUrls] = useState<any[]>([]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch(url);
    //     if (!response.ok || !response.body) {
    //       throw response.statusText;
    //     }

    //     const reader = response.body.getReader();
    //     const decoder = new TextDecoder();

    //     while (true) {
    //       const { value, done } = await reader.read();
    //       if (done) {
    //         setLoading(false);
    //         break;
    //       }

    //       const decodedChunk = decoder.decode(value, { stream: true });
    //       setData(prevValue => `${prevValue}${decodedChunk}`);
    //     }
    //   } catch (error) {
    //     setLoading(false);
    //     // Handle other errors
    //   }
    // };

    // fetchData();
    const urlList = authorizations.map(auth => {
      return { ...auth, ipAddressName: "http://" + auth.ipAddressName + ":8000" };
    });
    setUrls(urlList);
    console.log("urlList", urlList)

  }, [authorizations]);

  const [refreshseed, setrefreshseed] = useState(0);

  setInterval(() => {
    setrefreshseed(refreshseed => refreshseed + 1);
    console.log("refreshseed", refreshseed);
  }, 5000);

  return (
    <div className="flex justify-between self-center gap-6">
      <div className="flex flex-row gap-6">
        <Accordion multiple>
          {
            urls.map(value => {

              return (
                <AccordionTab header={value.sensorName} >
                  <div className="w-full h-full">
                    <iframe key={refreshseed} className="w-[50vw] h-[50vh]" src={value.ipAddressName}></iframe>
                    {/* <div className="mb-1 block font-medium">{value.sensorName}</div> */}
                  </div>
                </AccordionTab>
              )
            })
          }
        </Accordion>
      </div>
    </div>

    // <div className="w-[100vw] h-[100vh]">
    //   <iframe className="w-[100vw] h-[100vh]" src={url}></iframe>
    // </div>
  );
}

export default ViewCameraFeeds;
