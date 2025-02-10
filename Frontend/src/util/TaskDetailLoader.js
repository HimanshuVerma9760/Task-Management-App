export const TaskDetailLoader = async ({ request }) => {
  const id = request.url.toString().split("/")[4];
  console.log("frontend id:", id);
  try {
    const result = await fetch(`http://localhost:3000/detail/${id}`);
    if (result.ok) {
      return result;
    } else {
      console.log(result.statusText);
      return { message: "Some error occured!" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Some error occured while fetcing data!" };
  }
};
