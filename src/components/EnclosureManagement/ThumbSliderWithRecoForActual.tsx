import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

// interface PropTypes {
//     minValue:
// }

const ThumbSliderWithRecoForActual = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-danger">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      key={1}
      className="flex h-8 w-32 items-center justify-center rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      asChild
    >
      {props != undefined && props.value != undefined && (
        <span className="text-center">Reco Min - {props.value[0]}</span>
      )}
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
ThumbSliderWithRecoForActual.displayName = SliderPrimitive.Root.displayName;

export { ThumbSliderWithRecoForActual };
