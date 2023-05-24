import Slider from "./TSlider";

export default function StatSlider({ statName, ...props }) {
  return (
    <Slider
      title={statName}
      label={(val) => val}
      min={1}
      max={255}
      {...props}
    />
  );
}
