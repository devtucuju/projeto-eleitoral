import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MapOne from "@/components/maps/others/MapOne";
import MapTwo from "@/components/maps/others/MapTwo";
import MapThree from "@/components/maps/others/MapThree";


export default function Maps() {
  return (
    <>
      <PageBreadcrumb pageTitle="Maps" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapOne />
        <MapTwo />
        <MapThree />
      </div>
    </>
  );
}
