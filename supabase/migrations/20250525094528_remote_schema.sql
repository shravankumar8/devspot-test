set check_function_bodies = off;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_auth_user_updated AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_updated_user();

CREATE TRIGGER preset_otp BEFORE INSERT OR UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION preset_otp();


create policy "Authenticated users can manage images rpt89z_0"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'profile-assets'::text));


create policy "Authenticated users can manage images rpt89z_1"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'profile-assets'::text));


create policy "Authenticated users can manage images rpt89z_2"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'profile-assets'::text));


create policy "Public access to delete hackathon images"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'hackathon-images'::text));


create policy "Public access to update hackathon images"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'hackathon-images'::text));


create policy "Public access to upload hackathon images"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'hackathon-images'::text));


create policy "Public access to view hackathon images"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'hackathon-images'::text));


create policy "Public access to view profile images rpt89z_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'profile-assets'::text));


create policy "TESTING 1sr0vws_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'project-videos'::text));


create policy "TESTING 1sr0vws_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'project-videos'::text));


create policy "TESTING 1sr0vws_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'project-videos'::text));


create policy "TESTING 1sr0vws_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'project-videos'::text));



