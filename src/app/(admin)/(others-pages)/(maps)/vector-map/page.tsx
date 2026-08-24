import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VectorMapOne from "@/components/maps/vector-map/VectorMapOne";
import VectorMapTwo from "@/components/maps/vector-map/VectorMapTwo";
import VectorMapThree from "@/components/maps/vector-map/VectorMapThree";



export default function VectorMap() {
  return (
    <>
      <PageBreadcrumb pageTitle="Vector Map" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VectorMapOne />
        <VectorMapTwo />
        <VectorMapThree />
      </div>
    </>
  );
}
