import React, { useEffect, useState } from "react";
import useApiJson from "../hooks/useApiJson";


// class Test extends React.Component {

//     constructor(props:any) {
//         super(props);
//         this.state = {
//            imgSrc: '',
//         };
//      }

//     componentDidMount() {
//         const apiJSON = useApiJson();

//         fetch('http://localhost:8181/images/appliance-OTHER.svg', {
//              method: "GET",
//              headers: { Authorization: 'Bearer eyJhbGciOiJIU' }
//         }).then((response:any) => {
//             const data = `data:${response.headers['content-type']};base64,${new Buffer(response.data).toString('base64')}`;
//             this.setState({ imgSrc: data });

//         });
//     }

//     render() {
//     const { imgSrc } = this.state as any;
//     return (
//         <img src={imgSrc} alt="love is gone" />
//     )
//     }
//   }

function TestPage() {
    const [imgSrc, setImgSrc] = React.useState<any>(0);
    const useApi = useApiJson();

    useEffect(() => {
        const streamImage = async () => {
            const response = await fetch('http://localhost:8000/detected.jpeg');
            const reader = response.body?.getReader();
            let chunks: Uint8Array[] = [];
            let boundary = new TextEncoder().encode('--FRAME\r\n');

            while (true) {
                const { done, value } = await reader?.read() as any;
                if (done) break;

                for (const chunk of value) {
                    chunks.push(chunk);

                    if (chunks.length >= boundary.length) {
                        const isBoundary = chunks.slice(-boundary.length).every((byte:any, i) => byte === boundary[i]);
                        if (isBoundary) {
                            chunks = chunks.slice(0, -boundary.length); // Remove the boundary

                            const blob = new Blob(chunks, { type: 'image/jpeg' });
                            console.log("blob",blob)
                            const objectURL = URL.createObjectURL(blob);
                            setImgSrc(objectURL);
                            chunks = [];
                        }
                    }
                }
            }
        };

        streamImage();
    }, []);


  return (
    <div className="w-[100vw] h-[100vh] bg-blue-200">
    <img src={imgSrc} alt="love is gone" />
    <iframe src={imgSrc}  className="w-full h-full bg-red-200 aspect-video"></iframe>
    </div>
);
}

export default TestPage;

// function LoginPage() {
//     return (
//       <div className="flex h-screen">
//         <aside className="flex w-1/2 flex-col justify-center bg-black">
//           <img
//             src="/logos/nocircle-cream.png"
//             alt="Zoovanna Logo"
//             className="fixed left-8 top-8 h-1/6 w-min"
//           />
//           <span className="self-center font-dmSans text-5xl font-medium leading-tight text-whiten">
//             Welcome to <br /> Zoovanna Admin Portal
//           </span>
//         </aside>
//         <main className="bg-zoovanna-cream flex w-1/2 items-center justify-center">
//         </main>
//       </div>
//     );
//   }
  
//   export default LoginPage;
  