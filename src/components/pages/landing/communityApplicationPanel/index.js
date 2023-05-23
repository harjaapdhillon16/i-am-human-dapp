import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Panel } from '../../../common/panel';
import { clientStorage } from '../../../../utils/supabase-storage';
import { wallet } from '../../../../index';
import { api_link, supabase } from '../../../../utils/supabase';
import { toast } from 'react-toastify';
import axios from 'axios';

export const CommunityApplicationPanel = ({
  open,
  setOpen,
  fetchCommunities,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const onSubmit = async (data) => {
    try {
      setFormLoading(true);
      const { data: fileData } = await clientStorage
        .from('community-artworks')
        .upload(`${wallet.accountId}/image`, data.communityArtwork[0], {
          contentType: 'image/png',
        });
      await supabase.insert('community-artwork', {
        name: data.communityName,
        description: data.communityDescription,
        link: data.communityLink,
        account: wallet.accountId,
        email: data.email,
        imagelink: `https://ndxjhhgwpydyiayqbkdr.supabase.co/storage/v1/object/public/community-artworks/${fileData.path}`,
      });
      toast.success('Applied for community successfully');
    } finally {
      setFormLoading(false);
      setOpen(false);
      reset();
      fetchCommunities();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return open ? (
    <div className="flex justify-center">
      <form
        onSubmit={!formLoading ? handleSubmit(onSubmit) : null}
        className="w-full"
      >
        <div className="py-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="communityName"
          >
            Community Name
          </label>
          <input
            {...register('communityName', {
              required: 'Community name is required',
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="communityName"
            type="text"
          />
          {errors.communityName && (
            <p className="text-red-500 mt-1 text-xs italic">
              {errors.communityName.message}
            </p>
          )}
        </div>
        <div className="py-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="communityDescription"
          >
            Community Description
          </label>
          <textarea
            {...register('communityDescription', {
              required: 'Community description is required',
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="communityDescription"
          />
          {errors.communityDescription && (
            <p className="text-red-500 mt-1 text-xs italic">
              {errors.communityDescription.message}
            </p>
          )}
        </div>
        <div className="py-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Your Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
          />
          {errors.email && (
            <p className="text-red-500 mt-1 text-xs italic">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="py-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="communityLink"
          >
            Community Link
          </label>
          <input
            {...register('communityLink', {
              required: 'Community link is required',
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="communityLink"
          />
          {errors.communityLink && (
            <p className="text-red-500 mt-1 text-xs italic">
              {errors.communityLink.message}
            </p>
          )}
        </div>
        <div className="py-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="communityArtwork"
          >
            Proposed Artwork for SBT Badge
          </label>
          <input
            {...register('communityArtwork', {
              required: 'Proposed Artwork for SBT Badge is required',
            })}
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="communityArtwork"
            type="file"
            accept="image/*"
          />
          {errors.communityArtwork && (
            <p className="text-red-500 mt-1 text-xs italic">
              {errors.communityArtwork.message}
            </p>
          )}
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="preview"
                className="w-[200px] h-[200px] object-cover object-center rounded-md"
              />
            </div>
          )}
        </div>
        <div className="py-2">
          <button
            className="bg-blue-500 w-60 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={formLoading}
          >
            {formLoading ? 'Applying' : 'Apply for Community SBT'}
          </button>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
};
