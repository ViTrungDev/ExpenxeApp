export default function formatNumber(number){
  if(!number) return "";
  return new Intl.NumberFormat('vi-VN').format(number);
}