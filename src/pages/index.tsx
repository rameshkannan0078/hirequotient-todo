import HrTable from "@/components/HrTable/HrTable";
import useUserList from "@/services/getUserList";


export default function Home() {
  const {userdata,loading} = useUserList();
  return (
   <div>
     <HrTable userdata={userdata}/>
   </div>
  )
}
