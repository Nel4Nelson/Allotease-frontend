/* eslint-disable react/no-unescaped-entities */
// /components/features/create/events/form-sections/details-step.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { AgendaBuilder } from "../components/agenda-builder";
import { TagSelector } from "../components/tag-selector";
import {
  EventFormData,
  CreateEventStepProps,
  AgendaItem,
} from "@/types/events";

const detailsSchema = z.object({
  capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .max(10000, "Capacity cannot exceed 10,000"),

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price cannot exceed 1,000,000"),

  isFree: z.boolean(),

  agenda: z
    .array(
      z.object({
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
      })
    )
    .min(1, "At least one agenda item is required"),

  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

export function DetailsStep({
  data,
  onNext,
  onBack,
  isLoading,
}: CreateEventStepProps) {
  const [agenda, setAgenda] = useState<AgendaItem[]>(data.agenda || []);
  const [tags, setTags] = useState<string[]>(data.tags || []);
  const [isFree, setIsFree] = useState(data.isFree || false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    mode: "onChange",
    defaultValues: {
      capacity: data.capacity || 50,
      price: data.price || 0,
      isFree: data.isFree || false,
      agenda: data.agenda || [],
      tags: data.tags || [],
    },
  });

  const watchedIsFree = watch("isFree");

  React.useEffect(() => {
    setValue("agenda", agenda, { shouldValidate: true });
  }, [agenda, setValue]);

  React.useEffect(() => {
    setValue("tags", tags, { shouldValidate: true });
  }, [tags, setValue]);

  React.useEffect(() => {
    if (watchedIsFree) {
      setValue("price", 0);
    }
  }, [watchedIsFree, setValue]);

  const handleFreeToggle = (checked: boolean) => {
    setIsFree(checked);
    setValue("isFree", checked, { shouldValidate: true });
    if (checked) {
      setValue("price", 0, { shouldValidate: true });
    }
  };

  const onSubmit = (formData: DetailsFormData) => {
    const stepData: Partial<EventFormData> = {
      ...formData,
      agenda,
      tags,
    };
    onNext(stepData);
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-space-grotesk text-[var(--title-color)]">
          Event Details
        </h2>
        <p className="text-[var(--body-text)] font-source-sans-pro">
          Add the finishing touches to make your event complete and engaging.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Agenda Section */}
        <AgendaBuilder
          value={agenda}
          onChange={setAgenda}
          error={errors.agenda?.message}
        />

        {/* Tags Section */}
        <TagSelector
          value={tags}
          onChange={setTags}
          error={errors.tags?.message}
        />

        {/* Capacity Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
            What's the capacity for your event?
          </h3>
          <p className="text-sm text-[var(--body-text)] font-source-sans-pro">
            Event capacity is the total number of tickets you're willing to
            sell.
          </p>

          <div className="max-w-xs">
            <FormInput
              type="number"
              placeholder="Total capacity*"
              min="1"
              max="10000"
              error={errors.capacity?.message}
              {...register("capacity", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
            How much do you want to charge for tickets?
          </h3>
          <p className="text-sm text-[var(--body-text)] font-source-sans-pro">
            Our tool can only generate external admission ticket for now. You
            can add and sell more ticket types later.
          </p>

          {/* Free Event Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="free-event"
              checked={isFree}
              onChange={(e) => handleFreeToggle(e.target.checked)}
              className="w-4 h-4 text-[var(--feature-accent-orange)] bg-white border-2 border-[var(--input-border)] rounded focus:ring-[var(--feature-accent-orange)] focus:ring-2"
            />
            <label
              htmlFor="free-event"
              className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro"
            >
              My event is free
            </label>
            <div className="w-3 h-3 bg-[var(--feature-accent-orange)] rounded-full"></div>
          </div>

          {/* Price Input */}
          {!isFree && (
            <div className="max-w-xs">
              <FormInput
                type="number"
                placeholder="Price*"
                min="0"
                step="0.01"
                error={errors.price?.message}
                {...register("price", { valueAsNumber: true })}
              />
            </div>
          )}

          {isFree && (
            <div className="text-sm text-green-600 font-source-sans-pro">
              ✓ This event is free for attendees
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="px-8"
          >
            ← Back
          </Button>

          <Button
            type="submit"
            variant="signup-primary"
            size="allotease-lg"
            className="px-8"
            disabled={!isValid || isLoading}
            loading={isLoading}
          >
            Preview Event
          </Button>
        </div>
      </form>
    </div>
  );
}
