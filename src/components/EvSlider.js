import Slider from "./TSlider";

export default function EvSlider({
  statName,
  disabled,
  calcedValue,
  inputProps,
  ...props
}) {
  return (
    <Slider
      title={statName}
      label={(val) => val}
      min={0}
      max={3}
      disabled={disabled}
      {...(disabled ? { value: calcedValue } : inputProps)}
      {...props}
    />
  );
}
