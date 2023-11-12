import React, { useEffect } from "react";
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

    useEffect(()=>{
        console.log("test1")

        const options: RequestInit = {
            method : "GET",
            headers: { 
                Authorization: 'Bearer eyJhbGciOiJIU', 
                "Content-Type": "application/json", 
            },
            
          };


    //     fetch('http://localhost:8000/detected.jpeg', options).then((response:any) => {
    //     console.log("test2", response.headers,response.data)
    //        const data = `data:${response.headers['content-type']};base64,${new Buffer(response.data).toString('base64')}`;
    //        console.log("data",data);
    //        setImgSrc(data );
   
    //    });
          useApi.get("http://localhost:8000/detected.jpeg").then((response:any) => {
                console.log("test2", response.headers,response.data)
                   const data = `data:${response.headers['content-type']};base64,${new Buffer(response.data).toString('base64')}`;
                   console.log("data",data);
                   setImgSrc(data );
               });

    }, [])


  return (
    <div>
    <div>Hello world</div>
    {/* <img src={imgSrc} alt="love is gone" /> */}
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
  