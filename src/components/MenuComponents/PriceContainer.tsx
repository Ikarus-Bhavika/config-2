
import { useState, RefObject } from "react";
import useDataStore from "../../store/store";
import getPrice from "../../utils/getPrice.js";
// import handleTakeScreenshot from "../../utils/handleTakeScreenshot.js";
import emailjs from "emailjs-com";
import html2canvas from "html2canvas";
import { supabase } from "../../../supabase";
import { uploadToCloudinary} from "../../cloudinaryUtil.ts";

export default function PriceContainer({
  configRef,
}: {
  configRef: RefObject<HTMLDivElement | null>;
}) {
  const store = useDataStore();
  const price = getPrice(store.modelConfig, store.preset, 0).price + 2000;
  
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const sendEmailWithScreenshot = async () => {
    if (configRef && configRef.current) {
      html2canvas(configRef.current, { scale: 0.7, useCORS: true, logging: true })
      .then(async function (canvas) {
        let quality = 0.3;
        let screenshot = canvas.toDataURL("image/jpeg", quality);

        // Estimate size in KB
        let sizeInKB = Math.round((screenshot.length * 3) / 4 / 1024);
        console.log(`Initial Screenshot size: ${sizeInKB}KB`);

        // Dynamically reduce quality if needed
        while (sizeInKB > 50 && quality > 0.1) {
          quality -= 0.05;
          screenshot = canvas.toDataURL("image/jpeg", quality);
          sizeInKB = Math.round((screenshot.length * 3) / 4 / 1024);
          console.log(`Trying lower quality: ${quality}, size: ${sizeInKB}KB`);
        }

        if (sizeInKB > 50) {
          alert(
            `Screenshot still too large (${sizeInKB}KB) even after compression.`
          );
          return;
        }

        try {
          canvas.toBlob(async (blob)=>{
            if(blob){
              const imageUrl = await uploadToCloudinary(new File([blob],'previewImage')); // Upload to S3
              console.log(imageUrl);
              const templateParams = {
                name: userName,
                to_email: userEmail,
                template_html: `<img src="${imageUrl}" alt="Configuration Screenshot" style="max-width: 100%; border: 1px solid #ccc; border-radius: 8px;" />`,
              };

              await emailjs.send(
                "service_gd18hjc",
                "template_ojjsgzg",
                templateParams,
                "fmaub9-_CMhm8MKRi"
              );
              const { error: insertError } = await supabase
                .from("configurations")
                .insert([
                  {
                    name: userName,
                    email: userEmail,
                    image_url: imageUrl,
                    created_at: new Date().toISOString(),
                  },
                ]);

              if (insertError) {
                console.error("❌ DB insert error:", insertError);
                alert("❌ Failed to save configuration to Supabase.");
                return;
              }

              alert("Configuration sent to your email!");
            }
          });
        } catch (error) {
          console.error(error);
          alert("Screenshot upload or email sending failed.");
        }
      });
    }
  };

  const handleSendConfiguration = () => {
    if (!userName || !userEmail) {
      alert("Please enter your name and email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert("Enter a valid email.");
      return;
    }

    // Close the modal and wait for it to disappear from the DOM before taking screenshot
    setShowModal(false);

    // Wait ~300ms for modal DOM transition/exit to finish before screenshot
    setTimeout(() => {
      sendEmailWithScreenshot();
    }, 400);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-lg"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Email Your Configuration
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md"
              />
              <input
                type="email"
                placeholder="Your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSendConfiguration}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {window.innerWidth < 1024 ? (
        <div className="flex flex-col gap-4 items-center">
          <div className="px-2 w-full flex justify-between font-semibold text-[18px]">
            <div className="text-[14px] font-medium">Total Price</div>
            <div className="text-[18px] font-medium">${price}.00</div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <button className="px-1 cursor-pointer flex gap-2 w-full justify-center items-center text-[16px] border border-black py-2 rounded-md font-semibold">
              <img src="/Online Store.png" className="w-6 h-6" alt="store" />
              Store near you
            </button>
            <button className="px-1 cursor-pointer flex gap-2 w-full justify-center items-center text-[16px] border border-black py-2 rounded-md font-semibold">
              <img src="/Timesheet.png" className="w-6 h-6" alt="appointment" />
              Book an appointment
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-1 cursor-pointer flex gap-2 w-full justify-center items-center text-[16px] border border-black py-2 rounded-md font-semibold"
            >
              <img
                src="/db581fd3-63ed-4ea6-b77f-4e4f8df2bc52.png"
                className="w-6 h-6"
                alt="save"
              />
              Save
            </button>
            <button className="px-1 cursor-pointer flex gap-2 w-full justify-center items-center text-[16px] bg-black text-white py-2 rounded-md font-semibold">
              <img
                src="/Add Shopping Cart.png"
                className="w-6 h-6"
                alt="cart"
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-4 items-center 3xl:pt-2">
          <div className="flex gap-4 items-center w-full 3xl:pt-2">
            <div className="w-1/3 flex flex-col">
              <div className="text-[14px] font-medium">Total Price</div>
              <div className="text-[18px] font-medium">${price}.00</div>
            </div>
            <div className="flex w-2/3 justify-end gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="w-1/2 cursor-pointer flex gap-1 items-center justify-center border border-black rounded-md whitespace-nowrap p-2 px-4 text-[14px] 2xl:text-[16px]"
              >
                <img
                  src="/db581fd3-63ed-4ea6-b77f-4e4f8df2bc52.png"
                  className="w-6 h-6"
                  alt="save"
                />
                Save
              </button>
              <button
    className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center bg-black text-white rounded-md p-2"
  >
    <img
      src="/Add Shopping Cart.png"
      className="w-6 h-6 object-contain"
      alt="cart"
    />
  </button>
            </div>
          </div>

          <div className="flex gap-4 items-center w-full 3xl:pt-2">
  {/* Store near you */}
  <button className="flex gap-2 items-center justify-center text-[16px] border border-gray-400 rounded-md py-2 px-4 min-w-[120px]">
    <img src="/Online Store.png" className="w-6 h-6" alt="store" />
    Store near you
  </button>

  {/* Book an appointment */}
  <button className="flex gap-2 items-center justify-center text-[16px] border border-gray-400 rounded-md py-2 px-4 min-w-[120px]">
    <img src="/Timesheet.png" className="w-6 h-6" alt="appointment" />
    Book an appointment
  </button>
</div>

        </div>
      )}
    </>
  );
}