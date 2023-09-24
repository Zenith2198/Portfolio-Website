import NewPostPanel from "@/components/NewPostPanel";
import EditPostPanel from "@/components/EditPostPanel";

export const dynamicParams = false;

export default function Panel({ params }: { params: { panel: string } }) {
	return (
		<div>
			<NewPostPanel className={`${params.panel==="newPost"?"block":"hidden"}`}/>
			<EditPostPanel className={`${params.panel==="editPost"?"block":"hidden"}`}/>
		</div>
	);
}