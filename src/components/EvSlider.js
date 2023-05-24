import Slider from "./TSlider";

export default function EvSlider({ statName, disabled, ...props }) {
  return (
    <Slider
      title={statName}
      label={(val) => val}
      min={0}
      max={3}
      disabled={disabled}
      {...props}
    />
  );
}
